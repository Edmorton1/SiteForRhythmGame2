// prettier-ignore
import { zIntNum, zISOString } from '../../../../../../../../../../libs/models/enums/zod';
// prettier-ignore
import { difficultiesZodSchema, TracksCursor, TracksQueryParams } from '../../../../../../../../../../libs/models/schemas/tracks';
import { TracksDays } from '../tracks.days';
import { AllTracksDays } from './allTracks.days';
import { AllTracksPopularity } from './allTracks.popularity';
import { AllTracksTable } from './allTracks.table';
import z, { ZodType } from 'zod';

export function createAllTracksInstance(options: TracksQueryParams) {
	const sort = options.sort;

	const validateCursorRow = <T extends ZodType<any>>(
		schema: T,
	): (Omit<TracksCursor, 'row'> & { row: z.infer<T> }) | undefined => {
		return options.cursor
			? { ...options.cursor, row: schema.parse(options.cursor.row) }
			: undefined;
	};

	if (TracksDays.isDays(sort)) {
		const cursor = validateCursorRow(zISOString);
		return new AllTracksDays({ ...options, sort, cursor });
	} else if (sort === 'popularity') {
		return new AllTracksPopularity({
			...options,
			sort,
			cursor: options.cursor
				? { ...options.cursor, row: undefined }
				: undefined,
		});
	} else {
		let cursor;

		if (sort === 'difficulty') {
			cursor = validateCursorRow(difficultiesZodSchema);
		} else {
			cursor = validateCursorRow(zIntNum);
		}

		return new AllTracksTable({
			...options,
			sort,
			cursor,
		});
	}
}
