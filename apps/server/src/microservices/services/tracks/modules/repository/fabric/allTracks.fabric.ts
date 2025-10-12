// prettier-ignore
import { zIntNum, zISOString } from '../../../../../../../../../libs/models/enums/zod';
import { TracksQueryParams } from '../../../../../../../../../libs/models/schemas/tracks';
import { TracksDays } from '../tracks.days';
// prettier-ignore
import { AllTracksDays, AllTracksPopularity, AllTracksTable } from './allTracks.table';

export function createAllTracksInstance(options: TracksQueryParams) {
	const sort = options.sort;

	if (TracksDays.isDays(sort)) {
		const row = zISOString.optional().parse(options.cursor);
		return new AllTracksDays({
			...options,
			sort,
			cursor: { ...options.cursor, row },
		});
	} else if (sort === 'popularity') {
		return new AllTracksPopularity({
			...options,
			sort,
			cursor: { ...options.cursor, row: undefined },
		});
	} else {
		const row = zIntNum.optional().parse(options.cursor);
		return new AllTracksTable({
			...options,
			sort,
			cursor: { ...options.cursor, row },
		});
	}
}
