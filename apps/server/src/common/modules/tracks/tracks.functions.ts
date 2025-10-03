// prettier-ignore
import type {Track, TrackDTO} from "../../../../../../libs/models/schemas/tracks"

export const TRACKS_KEYS = {
	getAllTracks: 'getAllTracks',
	getTrack: 'getTrack',
	postTrack: 'postTrack',
} as const;

export type TRACKS_FUNCTIONS = {
	[TRACKS_KEYS.getAllTracks]: { input: undefined; output: Track[] };
	[TRACKS_KEYS.getTrack]: { input: number; output: Track };
	[TRACKS_KEYS.postTrack]: { input: TrackDTO; output: Track };
};
