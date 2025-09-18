import { COMMON_TYPES } from '../../containers/TYPES.di';

export const FUNCS = {
	tracks: 'tracks',
	auth: 'auth',
} as const;

export const MICRO_TYPES = {
	services: { ...COMMON_TYPES.services },

	microApp: {
		server: Symbol.for('ServerMicroservice'),
		composite: Symbol.for('ServiceComposite'),
		instance: Symbol.for('ServiceInstance'),
	},

	microservices: {
		tracks: Symbol.for('TracksService'),
		auth: Symbol.for('AuthService'),
	},
};
