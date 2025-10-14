// prettier-ignore
import type { AllTracksServerReturn, Track, TrackDTO, TracksQueryParams } from "../../../../../../libs/models/schemas/tracks";

export const TRACKS_KEYS = {
	getAllTracks: 'getAllTracks',
	getSearchTrack: 'getSearchTrack',
	getTrack: 'getTrack',
	postTrack: 'postTrack',
	getSearchSuggestTrack: 'getSearchSuggestTrack',
} as const;

export type TRACKS_FUNCTIONS = {
	[TRACKS_KEYS.getAllTracks]: {
		input: TracksQueryParams;
		output: AllTracksServerReturn;
	};
	[TRACKS_KEYS.getSearchTrack]: { input: string; output: Track[] };
	[TRACKS_KEYS.getTrack]: { input: number; output: Track };
	[TRACKS_KEYS.postTrack]: { input: TrackDTO; output: Track };
	[TRACKS_KEYS.getSearchSuggestTrack]: { input: string; output: string[] };
};
