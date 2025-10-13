import z, { ZodType } from 'zod';
// prettier-ignore
import { zIntNum, zISOString } from '../../../../../../../../../libs/models/enums/zod';
// prettier-ignore
import { difficultiesTracks, difficultiesZodSchema, TracksCursor, TracksQueryParams } from '../../../../../../../../../libs/models/schemas/tracks';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { TracksDays } from '../tracks.days';
import { AllTracksDays } from './allTracks.days';
import { AllTracksPopularity } from './allTracks.popularity';
import { AllTracksTable } from './allTracks.table';

export function createAllTracksInstance(
	db: DatabaseAdapter,
	options: TracksQueryParams,
) {
	if (options.sort === undefined) {
		options.sort = 'popularity';
	}

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
		return new AllTracksDays(db, { ...options, sort, cursor });
	} else if (sort === 'popularity') {
		return new AllTracksPopularity(db, {
			...options,
			sort,
			cursor: options.cursor
				? { ...options.cursor, row: undefined }
				: undefined,
		});
	} else {
		console.log('КУРСОР ПЕРЕД ПАРСОМ', options.cursor);
		let cursor;

		if (sort === 'difficulty') {
			cursor = validateCursorRow(difficultiesZodSchema);
		} else {
			cursor = validateCursorRow(zIntNum);
		}

		return new AllTracksTable(db, {
			...options,
			sort,
			cursor,
		});
	}
}
