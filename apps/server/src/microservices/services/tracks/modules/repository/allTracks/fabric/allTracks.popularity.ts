import { AllTracksAbstract } from './allTracks.abstract';
import { TracksQueryParamsPopularity } from './types';

export class AllTracksPopularity extends AllTracksAbstract {
	constructor(
		protected override readonly options: TracksQueryParamsPopularity,
	) {
		super(options);
	}

	protected useSort = () => {
		this.query = this.query.orderBy('popularity', 'desc').orderBy('id', 'desc');
	};

	protected usePagination = () => {
		if (!this.options.cursor) return;

		this.query = this.query.where(eb => this.paginateByPopularity(eb));
	};

	public getAllTracks = async () => {
		const { tracks, cursorWithoutRow } = await this.getTracks();

		const cursor = { ...cursorWithoutRow, row: undefined };

		return { tracks, cursor };
	};
}
