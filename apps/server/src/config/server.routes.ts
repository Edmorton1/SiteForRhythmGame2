import { Router } from 'express';
import { BaseController } from './base.controller';
import { AUTH_TYPES } from '../services/auth/containers/TYPES.di';
import { authContainer } from '../services/auth/containers/container.di';

export class ServerRoutes {
	router: Router;

	constructor() {
		this.router = Router();

		const controllers: BaseController[] = Object.values(
			// TODO: ВРЕМЕННЫЙ ПЕРЕХОД, ПОТОМ УБРАТЬ
			AUTH_TYPES.modules,
			// TODO: ВРЕМЕННЫЙ ПЕРЕХОД, ПОТОМ УБРАТЬ
		).map(e => authContainer.get(e.controller));

		controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
