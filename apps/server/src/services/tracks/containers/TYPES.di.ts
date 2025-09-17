import { COMMON_TYPES } from '../../../containers/TYPES.di';

export const TRACKS_TYPES = {
	...COMMON_TYPES,

	modules: {
		tracks: {
			service: Symbol.for('TracksService'),
			repository: Symbol.for('TracksRepository'),
		},
	},
};
