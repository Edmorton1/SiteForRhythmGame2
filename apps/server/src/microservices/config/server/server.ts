import { inject } from 'inversify';
// prettier-ignore
import { KafkaLoader, KafkaLoadingOptions } from '../kafka/kafka.loader';
import { MICRO } from '../containers/micro.types';
import { ElasticSearchLoader } from '../elasticsearch/elasticsearch.loader';

export class ServerMicroservice {
	constructor(
		@inject(MICRO.app.kafkaLoader)
		private readonly kafkaMicroservice: KafkaLoader,
		@inject(MICRO.app.elasticLoading)
		private readonly elasticSearchLoader: ElasticSearchLoader,
	) {}

	start = async (options: KafkaLoadingOptions) => {
		// !NOTEBOOK: ВРЕМЕННОЕ ОТКЛЮЧЕНИЕ НА НОУТБУКЕ
		// await this.elasticSearchLoader.loadElastics();
		await this.kafkaMicroservice.start(options);
	};

	close = async () => {};
}
