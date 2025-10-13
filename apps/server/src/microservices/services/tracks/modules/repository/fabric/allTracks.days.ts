import { sql } from 'kysely';
// prettier-ignore
import { TracksCursor, TracksQueryParams } from '../../../../../../../../../libs/models/schemas/tracks';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { DaysKeys, TracksDays } from '../tracks.days';
import { AllTracksAbstract } from './allTracks.abstract';

export class AllTracksDays extends AllTracksAbstract {
	private readonly days: number;

	constructor(
		protected override readonly db: DatabaseAdapter,
		protected override readonly options: TracksQueryParams & {
			sort: DaysKeys;
			cursor: TracksCursor<'days'> | undefined;
		},
	) {
		super(db, options);
		this.days = TracksDays.days[options.sort];
	}

	protected usePagination = () => {
		const cursor = this.options.cursor;
		if (cursor) {
			this.query = this.query.where(eb =>
				eb.or([
					// cursor.created_at < NOW() - INTERVAL '31 days'
					// @ts-ignore
					eb.and([
						sql`${cursor.row} < NOW() - INTERVAL '${sql.lit(this.days)} days'`,
						sql`NOW() - created_at > INTERVAL '${sql.lit(this.days)} days'`,
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
						sql`${cursor.row} >= NOW() - INTERVAL '${sql.lit(this.days)} days'`,
						// @ts-ignore
						eb.or([
							// @ts-ignore
							eb.and([
								sql`NOW() - created_at < INTERVAL '${sql.lit(this.days)} days'`,
								eb.or([
									eb('popularity', '<', cursor.popularity),
									eb.and([
										eb('popularity', '=', cursor.popularity),
										eb('id', '<', cursor.id),
									]),
								]),
							]),
							sql`NOW() - created_at > INTERVAL '${sql.lit(this.days)} days'`,
						]),
					]),
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
}
