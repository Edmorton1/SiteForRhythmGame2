import { Router } from 'express';
import { BaseController } from './base.controller';
import { injectable, multiInject } from 'inversify';
import { WEB_TYPES } from '../../container/TYPES.di';

@injectable()
export class ControllerCollector {
	router: Router;

	constructor(
		@multiInject(WEB_TYPES.controllers)
		private readonly controllers: BaseController[],
	) {
		this.router = Router();

		for (const controller of this.controllers) {
			this.router.use(controller.router);
		}
	}
}
