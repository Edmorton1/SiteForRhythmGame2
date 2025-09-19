import { COMMON_TYPES } from '../../../web-server/container/TYPES.di';

export const TRACKS_TYPES = {
	...COMMON_TYPES,

	modules: {
		tracks: {
			controller: Symbol.for('TracksController'),
			service: Symbol.for('TracksService'),
			repository: Symbol.for('TracksRepository'),
		},
	},
};
