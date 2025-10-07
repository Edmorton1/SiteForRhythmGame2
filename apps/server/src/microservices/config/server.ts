import { inject } from 'inversify';
// prettier-ignore
import { KafkaMicroservice, KafkaMicroserviceOptions } from './kafka.microservice';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ElasticMicroservice } from './elastic.microservice';

export class ServerMicroservice {
	constructor(
		@inject(MICRO_TYPES.app.kafka)
		private readonly kafkaMicroservice: KafkaMicroservice,
		@inject(MICRO_TYPES.app.elastic)
		private readonly elastic: ElasticMicroservice,
	) {}

	start = async (options: KafkaMicroserviceOptions) => {
		console.log('ПРОВЕРКА ЛИШНИХ ИМЁН');
		await this.elastic.loadElastics();
		await this.kafkaMicroservice.start(options);
	};

	close = async () => {};
}
