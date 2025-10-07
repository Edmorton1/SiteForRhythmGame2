import { Router } from 'express';
import { BaseController } from './base.controller';
import { injectable, multiInject } from 'inversify';
import { WEB } from '../../container/web.di';

@injectable()
export class ControllerCollector {
	router: Router;

	constructor(
		@multiInject(WEB.controllers)
		private readonly controllers: BaseController[],
	) {
		this.router = Router();

		for (const controller of this.controllers) {
			this.router.use(controller.router);
		}
	}
}
