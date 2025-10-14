import { TracksDays } from '../tracks.days';
import { AllTracksAbstract } from './allTracks.abstract';
import { TracksQueryParamsDays } from './types';
import { sql } from 'kysely';

export class AllTracksDays extends AllTracksAbstract {
	private readonly days: number;

	constructor(protected override readonly options: TracksQueryParamsDays) {
		super(options);
		this.days = TracksDays.days[options.sort];
	}

	protected usePagination = () => {
		const cursor = this.options.cursor;

		if (!cursor) return;

		const cursorDate = new Date(cursor.row);
		const daysAgo = new Date(Date.now() - this.days * 24 * 60 * 60 * 1000);
		const daysAgoISO = daysAgo.toISOString();

		if (cursorDate < daysAgo) {
			this.query = this.query.where(eb =>
				eb.and([
					eb('created_at', '<', daysAgoISO),
					this.paginateByPopularity(eb),
				]),
			);
		} else {
			this.query = this.query.where(eb =>
				eb.or([
					eb.and([
						eb('created_at', '>=', daysAgoISO),
						this.paginateByPopularity(eb),
					]),
					eb('created_at', '<', daysAgoISO),
				]),
			);
		}
	};

	protected useSort = () => {
		this.query = this.query
			.orderBy(
				sql`
				CASE
					WHEN NOW() - created_at < INTERVAL '${sql.lit(this.days)} days'
					THEN 1
					ELSE 0
				END`,
				'desc',
			)
			.orderBy('popularity', 'desc')
			.orderBy('id', 'desc');
	};

	public getAllTracks = async () => {
		const { tracks, cursorWithoutRow, lastElement } = await this.getTracks();

		const cursor: NonNullable<TracksQueryParamsDays['cursor']> = {
			...cursorWithoutRow,
			row: lastElement['created_at'],
		};

		return { tracks, cursor };
	};
}

// protected usePagination = () => {
// 	const cursor = this.options.cursor;
// 	if (!cursor) return;

// 	const cutoff = new Date(Date.now() - this.days * 24 * 60 * 60 * 1000);
// 	const cursorDate = new Date(cursor.row);
// 	const cursorIsOld = !Number.isNaN(cursorDate.getTime()) && cursorDate < cutoff;

// 	this.query = this.query.where((eb: any) => {
// 		const popularityCmp = (q: any) =>
// 			q.or([
// 				q('popularity', '<', cursor.popularity),
// 				q.and([
// 					q('popularity', '=', cursor.popularity),
// 					q('id', '<', cursor.id),
// 				]),
// 			]);

// 		if (cursorIsOld) {
// 			// cursor.created_at < cutoff
// 			// now - created_at > interval days  =>  created_at < cutoff
// 			return eb.and([eb('created_at', '<', cutoff), popularityCmp(eb)]);
// 		}

// 		// cursor.created_at >= cutoff
// 		// ( (now - created_at < interval days AND popularity comparison) OR now - created_at > interval days )
// 		// now - created_at < interval days  =>  created_at > cutoff
// 		return eb.and([
// 			eb.or([
// 				eb.and([eb('created_at', '>', cutoff), popularityCmp(eb)]),
// 				eb('created_at', '<', cutoff),
// 			]),
// 		]);
// 	});
// };

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
