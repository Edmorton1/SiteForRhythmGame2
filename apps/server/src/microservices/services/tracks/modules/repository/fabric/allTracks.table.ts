// prettier-ignore
import { TracksCursor, TracksQueryParams, tracksSort } from '../../../../../../../../../libs/models/schemas/tracks';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { DaysKeys } from '../tracks.days';
import { AllTracksAbstract } from './allTracks.abstract';

export class AllTracksTable extends AllTracksAbstract {
	constructor(
		protected override readonly db: DatabaseAdapter,
		protected override readonly options: TracksQueryParams & {
			sort: Exclude<(typeof tracksSort)[number], DaysKeys | 'popularity'>;
			cursor: TracksCursor<'tables'> | undefined;
		},
	) {
		super(db, options);
	}

	protected useSort = () => {
		const { sort } = this.options;

		this.query = this.query
			.orderBy(sort, 'desc')
			.orderBy('popularity', 'desc')
			.orderBy('id', 'desc');
	};

	protected usePagination = () => {
		if (this.options.cursor) {
			const { sort } = this.options;

			const { id, popularity, row } = this.options.cursor;

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
}
