// prettier-ignore
import { Difficulties, TRACKS_SORT, TracksQueryParams } from '../../../../../../../../../../libs/models/schemas/tracks';
import { DaysKeys } from '../tracks.days';

type TracksCursorBase = Omit<NonNullable<TracksQueryParams['cursor']>, 'row'>;
type TracksQueryParamsBase = Omit<TracksQueryParams, 'sort' | 'cursor'>;

export type TracksQueryParamsPopularity = TracksQueryParamsBase & {
	sort: 'popularity';
	cursor?: (TracksCursorBase & { row: undefined }) | undefined;
};

export type TracksQueryParamsDays = TracksQueryParamsBase & {
	sort: DaysKeys;
	cursor?: (TracksCursorBase & { row: string }) | undefined;
};

export type TracksQueryParamsTables = TracksQueryParamsBase & {
	sort: Exclude<(typeof TRACKS_SORT)[number], DaysKeys | 'popularity'>;
	cursor?: (TracksCursorBase & { row: number | Difficulties }) | undefined;
};
