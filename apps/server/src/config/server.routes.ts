import { Router } from 'express';
import { BaseController } from './base.controller';
import { Container, inject, injectable } from 'inversify';
import { CONTAINER, MODULE, Module } from '../containers/modules.di';

@injectable()
export class ServerRoutes {
	router: Router;

	constructor(
		@inject(MODULE)
		private readonly modules: Module,
		@inject(CONTAINER)
		private readonly container: Container,
	) {
		console.log('MODULES', modules);
		this.router = Router();

		const controllers: BaseController[] = Object.values(this.modules).map(e =>
			this.container.get(e.controller),
		);

		controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
