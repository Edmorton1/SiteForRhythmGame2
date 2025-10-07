import { ContainerModule } from 'inversify';
import { MICRO } from './micro.types';
import { BaseService } from '../service/base.service';
import { ServiceCollector } from '../service/service.collector';
import { ServerMicroservice } from '../server/server';
import { ElasticSearchLoader } from '../elasticsearch/elasticsearch.loader';
import { KafkaLoader } from '../kafka/kafka.loader';

export const appMicroBindings = new ContainerModule(({ bind }) => {
	bind<BaseService>(MICRO.app.baseService).to(BaseService).inSingletonScope();

	bind<ServiceCollector>(MICRO.app.baseServiceCollector)
		.to(ServiceCollector)
		.inSingletonScope();

	bind<KafkaLoader>(MICRO.app.kafkaLoader).to(KafkaLoader).inSingletonScope();

	bind<ElasticSearchLoader>(MICRO.app.elasticLoading)
		.to(ElasticSearchLoader)
		.inSingletonScope();

	bind<ServerMicroservice>(MICRO.app.server)
		.to(ServerMicroservice)
		.inSingletonScope();
});
