// prettier-ignore
import { TracksCursor, TracksQueryParams, tracksSort } from '../../../../../../../../../libs/models/schemas/tracks';
import { DaysKeys } from '../tracks.days';
import { AllTracksAbstract } from './allTracks.abstract';

export class AllTracksTable extends AllTracksAbstract {
	constructor(
		private readonly options: TracksQueryParams & {
			sort: Exclude<(typeof tracksSort)[number], DaysKeys | 'popularity'>;
			cursor: TracksCursor & { row: number | undefined };
		},
	) {
		super();
	}
}

export class AllTracksPopularity extends AllTracksAbstract {
	constructor(
		private readonly options: TracksQueryParams & {
			sort: 'popularity';
			cursor: TracksCursor & { row: undefined };
		},
	) {
		super();
	}
}

export class AllTracksDays extends AllTracksAbstract {
	constructor(
		private readonly options: TracksQueryParams & {
			sort: DaysKeys;
			cursor: TracksCursor & { row: string | undefined };
		},
	) {
		super();
	}
}
