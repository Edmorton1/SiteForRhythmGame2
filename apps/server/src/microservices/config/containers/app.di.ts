import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from './TYPES.di';
import { BaseService } from '../service/base.service';
import { ServiceCollector } from '../service/service.collector';
import { ServerMicroservice } from '../server/server';
import { ElasticSearchLoader } from '../elasticsearch/elasticsearch.loader';
import { KafkaLoader } from '../kafka/kafka.loader';

export const appMicroBindings = new ContainerModule(({ bind }) => {
	bind<BaseService>(MICRO_TYPES.app.baseService)
		.to(BaseService)
		.inSingletonScope();

	bind<ServiceCollector>(MICRO_TYPES.app.baseServiceCollector)
		.to(ServiceCollector)
		.inSingletonScope();

	bind<KafkaLoader>(MICRO_TYPES.app.kafkaLoader)
		.to(KafkaLoader)
		.inSingletonScope();

	bind<ElasticSearchLoader>(MICRO_TYPES.app.elasticLoader)
		.to(ElasticSearchLoader)
		.inSingletonScope();

	bind<ServerMicroservice>(MICRO_TYPES.app.server)
		.to(ServerMicroservice)
		.inSingletonScope();
});
