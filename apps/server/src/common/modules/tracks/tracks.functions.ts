import { CountryCodes } from '../../../../../../libs/models/enums/countries';
// prettier-ignore
import type { Track, TrackDTO, TracksSort } from "../../../../../../libs/models/schemas/tracks"
import { Difficulties } from '../../services/postgres/database.type';

export const TRACKS_KEYS = {
	getAllTracks: 'getAllTracks',
	getTrack: 'getTrack',
	postTrack: 'postTrack',
} as const;

export type TRACKS_FUNCTIONS = {
	[TRACKS_KEYS.getAllTracks]: {
		input: {
			cursor: number | undefined;
			sort: TracksSort | undefined;
			lang: CountryCodes[] | undefined;
			difficulty: Difficulties[] | undefined;
		};
		output: Track[];
	};
	[TRACKS_KEYS.getTrack]: { input: number; output: Track };
	[TRACKS_KEYS.postTrack]: { input: TrackDTO; output: Track };
};
