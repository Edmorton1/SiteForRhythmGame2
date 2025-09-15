import { Router } from 'express';
import { COMMON_TYPES } from '../containers/TYPES.di';
import { container } from '../containers/container.di';
import { BaseController } from './base.controller';

export class ServerRoutes {
	router: Router;

	constructor() {
		this.router = Router();

		const controllers: BaseController[] = Object.values(
			COMMON_TYPES.modules,
		).map(e => container.get(e.controller));

		controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
