import { lazy } from 'react';

export const LazyMain = lazy(async () =>
	import('../pages/home/Home').then(module => ({ default: module.Home })),
);
export const LazyRegistration = lazy(async () =>
	import('../pages/registration/Registration').then(module => ({
		default: module.Registration,
	})),
);
export const LazyLogin = lazy(async () =>
	import('../pages/login/Login').then(module => ({ default: module.Login })),
);
