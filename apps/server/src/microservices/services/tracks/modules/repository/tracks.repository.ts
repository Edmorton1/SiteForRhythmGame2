import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { TRACKS_FUNCTIONS } from '../../../../../common/modules/tracks/tracks.functions';
import { sql } from 'kysely';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';

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
		// const isNeedPopularity = true;

		// TODO: Сделать чтобы в запросах где не требуется popularity, не срабатывало
		// let query;
		// if (isNeedPopularity) {
		let query = this.db.db
			.with('tracks_with_popularity', db =>
				db
					.selectFrom('tracks')
					.selectAll()
					.select(() =>
						sql`(plays_count + likes_count * 2 +  downloads_count * 3)`.as(
							'popularity',
						),
					),
			)
			.selectFrom('tracks_with_popularity')
			.select(TRACKS_SELECT);
		// } else {
		// 	query = this.db.db.selectFrom('tracks').select(TRACKS_SELECT);
		// }

		// if (options.cursor) {
		// 	query = query.where('id', '>', options.cursor);
		// }

		if (options.sort) {
			if (isDays(options.sort)) {
				query = query
					.orderBy(
						sql`
					CASE
						WHEN NOW() - created_at < INTERVAL '${sql.lit(days[options.sort])} days'
						THEN 1
						ELSE 0
					END`,
						'desc',
					)
					.orderBy('popularity', 'desc')
					.orderBy('id', 'desc');
			} else {
				// if (options.sort === 'bpm' || options.sort === 'difficulty') {
				query = query
					.orderBy(options.sort, 'desc')
					.orderBy('popularity', 'desc')
					.orderBy('id', 'desc');
				// } else {
				// 	query = query.orderBy(options.sort, 'desc');
				// }
			}
		}

		if (options.lang) {
			query = query.where('lang', 'in', options.lang);
		}

		if (options.difficulty) {
			query = query.where('difficulty', 'in', options.difficulty);
		}

		return query.execute();
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

// !: ПОТОМ СДЕЛАТЬ ПРОСТО popularity
// most popular (TODAY) - (
// CASE
// 		WHEN NOW() - created_at < INTERVAL '1 days'
// 		THEN 1
// 		ELSE 0
// 	END DESC, plays_count DESC
// )

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
