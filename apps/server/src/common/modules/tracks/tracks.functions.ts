// prettier-ignore
import type { Track, TrackDTO, TracksQueryParams } from "../../../../../../libs/models/schemas/tracks"
import { PartialWithUndefined } from '../../../../../../libs/models/enums/types';

export const TRACKS_KEYS = {
	getAllTracks: 'getAllTracks',
	getSearchTrack: 'getSearchTrack',
	getTrack: 'getTrack',
	postTrack: 'postTrack',
	getSearchSuggestTrack: 'getSearchSuggestTrack',
} as const;

export type TRACKS_FUNCTIONS = {
	[TRACKS_KEYS.getAllTracks]: {
		input: PartialWithUndefined<TracksQueryParams>;
		output: Track[];
	};
	[TRACKS_KEYS.getSearchTrack]: { input: string; output: Track[] };
	[TRACKS_KEYS.getTrack]: { input: number; output: Track };
	[TRACKS_KEYS.postTrack]: { input: TrackDTO; output: Track };
	[TRACKS_KEYS.getSearchSuggestTrack]: { input: string; output: string[] };
};
