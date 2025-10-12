import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { TRACKS_FUNCTIONS } from '../../../../../common/modules/tracks/tracks.functions';
import { sql } from 'kysely';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';
import { HttpError } from '../../../../../common/http/http.error';
// prettier-ignore
import { TracksCursor } from '../../../../../../../../libs/models/schemas/tracks';

const LIMIT = 10;

const days = {
	today: 1,
	week: 7,
	month: 31,
	year: 365,
} as const;

function isDays(val: unknown): val is keyof typeof days {
	if (typeof val === 'string' && Object.keys(days).includes(val)) {
		return true;
	}
	return false;
}

// prettier-ignore
export const TRACKS_SELECT = [
  'id', 'name', 'name_en', 'author', 'performer',
  'about', 'cover_path', 'file_path', 'difficulty',
  'bpm', 'lang', 'likes_count', 'downloads_count',
  'plays_count', 'created_at', 'is_deleted',
] as const;

@injectable()
export class TracksRepository {
	constructor(
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
	) {}

	getAllTracks = async (options: TRACKS_FUNCTIONS['getAllTracks']['input']) => {
		console.log(options.cursor);
		if (options.sort === undefined) {
			options.sort = 'popularity';
		}

		let query = this.db.db
			.with('tracks_with_popularity', db =>
				db
					.selectFrom('tracks')
					.selectAll()
					.select(() =>
						sql<number>`(plays_count + likes_count * 2 +  downloads_count * 3)`.as(
							'popularity',
						),
					),
			)
			.selectFrom('tracks_with_popularity')
			.select([...TRACKS_SELECT, 'popularity']);

		if (!isDays(options.sort) && options.sort !== 'popularity') {
			const sort = options.sort;
			query = query
				.orderBy(sort, 'desc')
				.orderBy('popularity', 'desc')
				.orderBy('id', 'desc');

			if (options.cursor) {
				const { id, popularity, row } = options.cursor;

				if (!row) {
					throw new HttpError(409, 'Cursor does not contain the field row');
				}

				if (sort === 'difficulty' && typeof row === 'number') {
					throw new HttpError(
						409,
						'It is not possible to use a numeric row to sort by difficulty.',
					);
				}

				query = query.where(eb =>
					eb.or([
						eb(sort, '<', row),
						eb(sort, '=', row).and('popularity', '<', popularity),
						eb(sort, '=', row)
							.and('popularity', '=', popularity)
							.and('id', '<', id),
					]),
				);
			}
		} else {
			if (isDays(options.sort)) {
				query = query.orderBy(
					sql`
					CASE
						WHEN NOW() - created_at < INTERVAL '${sql.lit(days[options.sort])} days'
						THEN 1
						ELSE 0
					END`,
					'desc',
				);
			}

			query = query.orderBy('popularity', 'desc').orderBy('id', 'desc');

			if (options.cursor) {
				const { id, popularity } = options.cursor;
				query = query.where(eb =>
					eb.or([
						eb('popularity', '<', popularity),
						eb('popularity', '=', popularity).and('id', '<', id),
					]),
				);
			}
		}

		if (options.lang) {
			query = query.where('lang', 'in', options.lang);
		}

		if (options.difficulty) {
			query = query.where('difficulty', 'in', options.difficulty);
		}

		console.log('ЗАПРОС', query.compile().sql);
		const tracks = await query.limit(LIMIT).execute();
		console.log('РЕЗУЛЬТАТ', tracks);
		const lastElement = tracks[tracks.length - 1];

		if (!lastElement) {
			// TODO: Отправка ошибкой
			throw new HttpError(204);
		}

		const cursor: TracksCursor = {
			id: lastElement.id,
			// TODO: Типизировать popularity
			popularity: lastElement.popularity as number,
		};
		if (!isDays(options.sort)) {
			cursor.row = lastElement[options.sort];
		}

		return {
			tracks: tracks.map(({ popularity, ...track }) => track),
			cursor,
		};
	};

	getTrack = async (id: TRACKS_FUNCTIONS['getTrack']['input']) => {
		const track = await this.db.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', '=', id)
			.executeTakeFirst();

		return track;
	};
}

// По каким параметрам сортировать?

// plays_count - (plays_count, id)
// downloads_count - (downloads_count, id)
// likes_count - (likes_count, id)
// bpm - (bpm, plays_count, id)
// TODO: сделать нормальную сортировку по популярности
// difficulty - (difficulty DESC, likes_count)
// По сложности будет смотреть самые популярные и сложные
// TODO: Добавить по дате выхода (новые, старые)

// По дате выхода (сначала новые)
// По дате выхода (сначала старые)

// most popular (TODAY)
// WITH tracks_with_popularity AS (SELECT (plays_count + likes_count * 2 +  downloads_count * 3) as popularity, * FROM tracks)

// SELECT * FROM tracks_with_popularity
// WHERE
// popularity < 396 OR
// popularity = 396 AND id < 167
// ORDER BY
// 	CASE
// 		WHEN NOW() - created_at < INTERVAL '30 days'
// 		THEN 1
// 		ELSE 0
// 	END DESC, popularity DESC, id DESC
// LIMIT 2

// !: ТОЖЕ САМОЕ ЧТО И С TODAY, ТОЛЬКО ДНИ РАЗНЫЕ
// most popular (WEEK)
// most popular (MONTH)
// most popular (YEAR)

// * BPM, ID
// SELECT * FROM tracks
// WHERE bpm > 85 OR bpm >= 85 AND id < 165
// ORDER BY bpm, id DESC
// -- OFFSET 4
// LIMIT 2

// * BPM, PLAYS_COUNT, ID
// SELECT * FROM tracks
// -- WHERE
// -- bpm < 88 OR
// -- bpm = 88 AND plays_count = 125 AND id < 92 OR
// -- bpm = 88 AND plays_count < 125
// ORDER BY bpm DESC, plays_count DESC, id DESC
// -- OFFSET 4
// -- LIMIT 2

// * BPM, POPULARITY, ID
// WITH tracks_with_popularity AS (SELECT (plays_count + likes_count * 2 +  downloads_count * 3) as popularity, * FROM tracks)

// SELECT * FROM tracks_with_popularity
// WHERE
// bpm < 85 OR
// bpm = 85 AND popularity < 122 OR
// bpm = 85 AND popularity = 122 AND id < 166
// ORDER BY bpm, popularity DESC, id DESC
// -- OFFSET 4
// LIMIT 2

// ?: ПОТОМ УБРАТЬ
// SELECT * FROM tracks
// -- WHERE
// -- bpm < 88 OR
// -- bpm = 88 AND plays_count = 125 AND id < 92 OR
// -- bpm = 88 AND plays_count < 125
// ORDER BY bpm DESC, plays_count DESC, id DESC
// -- OFFSET 4
// -- LIMIT 2

// -- SELECT * FROM tracks
// -- WHERE plays_count < 122
// -- ORDER BY
// -- 	CASE
// -- 		WHEN NOW() - created_at < INTERVAL '50 days'
// -- 		THEN 1
// -- 		ELSE 0
// -- 	END DESC, plays_count DESC
// -- LIMIT 2

// * По популярности
// SELECT (plays_count + likes_count * 2 +  downloads_count * 3) as popularity, *
// FROM tracks
// ORDER BY popularity DESC, id DESC

// WITH tracks_with_popularity AS (SELECT (plays_count + likes_count * 2 +  downloads_count * 3) as popularity, * FROM tracks)

// SELECT * FROM tracks_with_popularity
// WHERE
// bpm < 128 OR
// bpm = 128 AND popularity < 268 OR
// bpm = 128 AND popularity = 268 AND id < 115
// ORDER BY bpm DESC, popularity DESC, id DESC
// -- OFFSET 4
// LIMIT 2
