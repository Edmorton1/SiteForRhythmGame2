import { MICRO_TYPES } from '../../../../microservices/config/containers/TYPES.di';

export const TRACKS_FUNCTIONS = {
	tracks: 'tracks',
	auth: 'auth',
} as const;

export const TRACKS_MICRO_TYPES = {
	...MICRO_TYPES,

	repository: {
		track: Symbol.for('TrackRepository'),
	},
} as const;
