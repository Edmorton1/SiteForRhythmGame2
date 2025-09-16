import { COMMON_TYPES } from '../../containers/TYPES.di';

export const GATEWAY_TYPES = {
	...COMMON_TYPES,

	modules: {
		tracks: {
			controller: Symbol.for('TracksController'),
		},
	},
	// controllers: {
	// 	tracks: Symbol.for('TracksController'),
	// },
};
