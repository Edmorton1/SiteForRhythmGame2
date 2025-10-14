import { AllTracksAbstract } from './allTracks.abstract';
import { TracksQueryParamsTables } from './types';

export class AllTracksTable extends AllTracksAbstract {
	constructor(protected override readonly options: TracksQueryParamsTables) {
		super(options);
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

	public getAllTracks = async () => {
		const { tracks, cursorWithoutRow, lastElement } = await this.getTracks();

		const cursor: NonNullable<TracksQueryParamsTables['cursor']> = {
			...cursorWithoutRow,
			row: lastElement[this.options.sort],
		};

		return { tracks, cursor };
	};
}
