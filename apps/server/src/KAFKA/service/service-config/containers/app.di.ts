import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from './TYPES.di';
import { BaseController } from '../base.controller';
import { ServiceCollector } from '../service.collector';
import { ServerMicroservice } from '../server.microservice';

export const appMicroBindings = new ContainerModule(({ bind }) => {
	bind<BaseController>(MICRO_TYPES.app.instance)
		.to(BaseController)
		.inSingletonScope();
	bind<ServiceCollector>(MICRO_TYPES.app.composite)
		.to(ServiceCollector)
		.inSingletonScope();
	bind<ServerMicroservice>(MICRO_TYPES.app.server)
		.to(ServerMicroservice)
		.inSingletonScope();
});
