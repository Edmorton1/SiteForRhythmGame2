import { ContainerModule } from 'inversify';
import { ElasticSearchAdapter } from '../adapters/elasticsearch/elasticsearch.adapter';
import { DatabaseAdapter } from '../adapters/postgres/database.adapters';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';

export const microservicesBindings = new ContainerModule(({ bind }) => {
	bind<DatabaseAdapter>(ADAPTERS.micro.database)
		.to(DatabaseAdapter)
		.inSingletonScope();

	bind<ElasticSearchAdapter>(ADAPTERS.micro.elasticsearch)
		.to(ElasticSearchAdapter)
		.inSingletonScope();
});
