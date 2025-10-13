// prettier-ignore
import { TracksCursor, TracksQueryParams } from '../../../../../../../../../libs/models/schemas/tracks';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { AllTracksAbstract } from './allTracks.abstract';

export class AllTracksPopularity extends AllTracksAbstract {
	constructor(
		protected override readonly db: DatabaseAdapter,
		protected override readonly options: TracksQueryParams & {
			sort: 'popularity';
			cursor: TracksCursor<'popularity'> | undefined;
		},
	) {
		super(db, options);
	}

	protected useSort = () => {
		this.query = this.query.orderBy('popularity', 'desc').orderBy('id', 'desc');
	};

	protected usePagination = () => {
		if (this.options.cursor) {
			const { id, popularity } = this.options.cursor;
			this.query = this.query.where(eb =>
				eb.or([
					eb('popularity', '<', popularity),
					eb('popularity', '=', popularity).and('id', '<', id),
				]),
			);
		}
	};
}
