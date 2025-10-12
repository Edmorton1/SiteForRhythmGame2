import { SelectQueryBuilder, sql } from 'kysely';
// prettier-ignore
import { Difficulties, Track, TracksCursor, TracksQueryParamsZodSchema } from '../../../../../../../../libs/models/schemas/tracks';
import { DatabaseKysely } from '../../../../common/adapters/postgres/database.type';
import { LanguagesCodes } from '../../../../../../../../libs/models/enums/countries';
import { HttpError } from '../../../../../common/http/http.error';
import z from 'zod';
import { DaysKeys, TracksDays } from './tracks.days';

const LIMIT = 5;

type TracksSelectQueryBuilder = SelectQueryBuilder<
	DatabaseKysely & { tracks_with_popularity: TracksWithPopularity },
	'tracks_with_popularity',
	TracksWithPopularity
>;

type TracksWithPopularity = Track & { popularity: number };
type TracksSort = z.infer<typeof TracksQueryParamsZodSchema.shape.sort>;

export class TracksQueryBuilder {
	constructor(private query: TracksSelectQueryBuilder) {}

	sortByTableRows = (
		sort: Exclude<TracksSort, 'popularity' | DaysKeys>,
		cursor: TracksCursor | undefined,
	) => {
		this.query = this.query
			.orderBy(sort, 'desc')
			.orderBy('popularity', 'desc')
			.orderBy('id', 'desc');

		if (cursor) {
			const { id, popularity, row } = cursor;

			if (typeof row !== 'number') {
				throw new HttpError(
					409,
					`The cursor does not contain a field string or is not in the correct format. It is currently - ${row}, and should be a number.`,
				);
			}

			if (sort === 'difficulty' && typeof row === 'number') {
				throw new HttpError(
					409,
					'It is not possible to use a numeric row to sort by difficulty.',
				);
			}

			this.query = this.query.where(eb =>
				eb.or([
					eb(sort, '<', row),
					eb(sort, '=', row).and('popularity', '<', popularity),
					eb(sort, '=', row)
						.and('popularity', '=', popularity)
						.and('id', '<', id),
				]),
			);
		}
	};

	paginationByDays = (
		days: number,
		cursor: Omit<TracksCursor, 'row'> & { row: string },
	) => {
		this.query = this.query.where(eb =>
			eb.or([
				// cursor.created_at < NOW() - INTERVAL '31 days'
				// @ts-ignore
				eb.and([
					sql`${cursor.row} < NOW() - INTERVAL '${sql.lit(days)} days'`,
					sql`NOW() - created_at > INTERVAL '${sql.lit(days)} days'`,
					eb.or([
						eb('popularity', '<', cursor.popularity),
						eb.and([
							eb('popularity', '=', cursor.popularity),
							eb('id', '<', cursor.id),
						]),
					]),
				]),

				// cursor.created_at >= NOW() - INTERVAL '31 days'
				// @ts-ignore
				eb.and([
					sql`${cursor.row} >= NOW() - INTERVAL '${sql.lit(days)} days'`,
					// @ts-ignore
					eb.or([
						// @ts-ignore
						eb.and([
							sql`NOW() - created_at < INTERVAL '${sql.lit(days)} days'`,
							eb.or([
								eb('popularity', '<', cursor.popularity),
								eb.and([
									eb('popularity', '=', cursor.popularity),
									eb('id', '<', cursor.id),
								]),
							]),
						]),
						sql`NOW() - created_at > INTERVAL '${sql.lit(days)} days'`,
					]),
				]),
			]),
		);
	};

	sortByDays = (days: number) => {
		this.query = this.query.orderBy(
			sql`
				CASE
					WHEN NOW() - created_at < INTERVAL '${sql.lit(days)} days'
					THEN 1
					ELSE 0
				END`,
			'desc',
		);
	};

	sortByPopularity = () => {
		this.query = this.query.orderBy('popularity', 'desc').orderBy('id', 'desc');
	};

	sortByPopularityCursorOnly = (cursor: TracksCursor) => {
		const { id, popularity } = cursor;
		this.query = this.query.where(eb =>
			eb.or([
				eb('popularity', '<', popularity),
				eb('popularity', '=', popularity).and('id', '<', id),
			]),
		);
	};

	filterByLang = (lang: LanguagesCodes[]) => {
		this.query = this.query.where('lang', 'in', lang);
	};

	filterByDifficulty = (difficulty: Difficulties[]) => {
		this.query = this.query.where('difficulty', 'in', difficulty);
	};

	result = async (sort: TracksSort) => {
		console.log(
			'ЗАПРОС',
			this.query.compile().sql,
			this.query.compile().parameters,
		);
		const tracks = await this.query.limit(LIMIT).execute();
		console.log('РЕЗУЛЬТАТ', tracks);
		const lastElement = tracks[tracks.length - 1];
		console.log('LAST ELEM', lastElement);

		if (!lastElement) {
			// TODO: Отправка ошибкой
			throw new HttpError(204);
		}

		const cursor: TracksCursor = {
			id: lastElement.id,
			popularity: lastElement.popularity,
			row: undefined,
		};
		if (!TracksDays.isDays(sort)) {
			cursor.row = lastElement[sort];
		} else {
			cursor.row = lastElement['created_at'];
		}

		return {
			tracks: tracks.map(({ popularity, ...track }) => track),
			cursor,
		};
	};
}

// !: Сортировка по популярности за месяц
// WHERE
//     (
//         ('2025-08-21 17:17:28.562331' < NOW() - INTERVAL '31 days'
//          AND NOW() - created_at > INTERVAL '31 days'
//          AND (popularity < 390 OR (popularity = 390 AND id < 113)))

//         OR

//         ('2025-08-21 17:17:28.562331' >= NOW() - INTERVAL '31 days'
//          AND (
//              (NOW() - created_at < INTERVAL '31 days'
//               AND (popularity < 390 OR (popularity = 390 AND id < 113)))
//              OR
//              (NOW() - created_at > INTERVAL '31 days')
//          ))
//     )

// ?: ИДЕЯ КАК СДЕЛАТЬ СОРТИРОВКУ ПО ПОПУЛЯРНОСТИ ЗА ВРЕМЯ
// Создать таблицу для игр. Если пользователь сыграл, записываем в таблицу.
// Она будет быстро расти, а мы будем каждый день
// удалять записи, которым больше месяца и записывать их в обычные числа к трекам,
// а когда надо будет сортировать, будем доставать эти записи из этой таблицы.
