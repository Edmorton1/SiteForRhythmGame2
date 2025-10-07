import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from './TYPES.di';
import { BaseService } from '../base.service';
import { ServiceCollector } from '../service.collector';
import { KafkaMicroservice } from '../kafka.microservice';
import { ServerMicroservice } from '../server';
import { ElasticMicroservice } from '../elastic.microservice';

export const appMicroBindings = new ContainerModule(({ bind }) => {
	bind<BaseService>(MICRO_TYPES.app.instance)
		.to(BaseService)
		.inSingletonScope();
	bind<ServiceCollector>(MICRO_TYPES.app.composite)
		.to(ServiceCollector)
		.inSingletonScope();
	bind<KafkaMicroservice>(MICRO_TYPES.app.kafka)
		.to(KafkaMicroservice)
		.inSingletonScope();
	bind<ElasticMicroservice>(MICRO_TYPES.app.elastic)
		.to(ElasticMicroservice)
		.inSingletonScope();
	bind<ServerMicroservice>(MICRO_TYPES.app.server)
		.to(ServerMicroservice)
		.inSingletonScope();
});
