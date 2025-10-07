import { inject } from 'inversify';
// prettier-ignore
import { KafkaLoader, KafkaLoadingOptions } from '../kafka/kafka.loader';
import { MICRO_TYPES } from '../containers/TYPES.di';
import { ElasticSearchLoader } from '../elasticsearch/elasticsearch.loader';

export class ServerMicroservice {
	constructor(
		@inject(MICRO_TYPES.app.kafkaLoader)
		private readonly kafkaMicroservice: KafkaLoader,
		@inject(MICRO_TYPES.app.elasticLoader)
		private readonly elastic: ElasticSearchLoader,
	) {}

	start = async (options: KafkaLoadingOptions) => {
		await this.elastic.loadElastics();
		await this.kafkaMicroservice.start(options);
	};

	close = async () => {};
}
