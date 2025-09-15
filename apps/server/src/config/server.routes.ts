import { Router } from 'express';
import { BaseController } from './base.controller';
import { inject, injectable } from 'inversify';
import { MODULE, Module } from '../containers/modules.di';
import { rootContainer } from '../containers/container.di';

@injectable()
export class ServerRoutes {
	router: Router;

	constructor(
		@inject(MODULE)
		private readonly modules: Module,
	) {
		console.log('MODULES', modules['tracks'].controller);
		this.router = Router();

		const controllers: BaseController[] = Object.values(this.modules).map(e =>
			rootContainer.get(e.controller),
		);

		controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
