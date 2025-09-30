import { Router } from 'express';
import { BaseController } from './base.controller';
import { injectable, multiInject } from 'inversify';
import { WEB_TYPES } from '../container/TYPES.di';

@injectable()
export class ServerRoutes {
	router: Router;

	constructor(
		@multiInject(WEB_TYPES.controllers)
		private readonly controllers: BaseController[],
	) {
		this.router = Router();

		// const controllers: BaseController[] = Object.values(this.modules).map(e =>
		// 	this.container.get(e.controller),
		// );

		this.controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
