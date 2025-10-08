import { CountryCodes } from '../../../../../../libs/models/enums/countries';
// prettier-ignore
import type { Difficulties, Track, TrackDTO, TracksSortZodSchema } from "../../../../../../libs/models/schemas/tracks"

export const TRACKS_KEYS = {
	getAllTracks: 'getAllTracks',
	getSearchTrack: 'getSearchTrack',
	getTrack: 'getTrack',
	postTrack: 'postTrack',
	getSearchSuggestTrack: 'getSearchSuggestTrack',
} as const;

export type TRACKS_FUNCTIONS = {
	[TRACKS_KEYS.getAllTracks]: {
		input: {
			cursor: number | undefined;
			sort: TracksSortZodSchema | undefined;
			lang: CountryCodes[] | undefined;
			difficulty: Difficulties[] | undefined;
		};
		output: Track[];
	};
	[TRACKS_KEYS.getSearchTrack]: { input: string; output: Track[] };
	[TRACKS_KEYS.getTrack]: { input: number; output: Track };
	[TRACKS_KEYS.postTrack]: { input: TrackDTO; output: Track };
	[TRACKS_KEYS.getSearchSuggestTrack]: { input: string; output: string[] };
};
