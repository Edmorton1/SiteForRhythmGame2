import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from '../TYPES.di';
import { ServiceInstance } from '../server.instance';
import { ServiceComposite } from '../service.composite';
import { ServerMicroservice } from '../server.microservice';

export const microAppBindings = new ContainerModule(({ bind }) => {
	bind<ServiceInstance>(MICRO_TYPES.microApp.instance)
		.to(ServiceInstance)
		.inSingletonScope();
	bind<ServiceComposite>(MICRO_TYPES.microApp.composite)
		.to(ServiceComposite)
		.inSingletonScope();
	bind<ServerMicroservice>(MICRO_TYPES.microApp.server)
		.to(ServerMicroservice)
		.inSingletonScope();
});
