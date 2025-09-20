import { WEB_TYPES } from '../../../../web-server/container/TYPES.di';

export const TRACKS_TYPES = {
	...WEB_TYPES,

	modules: {
		tracks: {
			controller: Symbol.for('TracksController'),
			service: Symbol.for('TracksService'),
			repository: Symbol.for('TracksRepository'),
		},
	},
};
