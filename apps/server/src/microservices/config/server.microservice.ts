import { inject, injectable } from 'inversify';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ServiceCollector } from './service.collector';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS } from '../../common/topics/TOPICS';
import { KafkaResponse } from './types';
import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';

@injectable()
export class ServerMicroservice {
	constructor(
		@inject(MICRO_TYPES.app.composite)
		private readonly composite: ServiceCollector,
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	start = async () => {
		console.log(`СТАРТ ServerMicroservice`);
		const consumer = this.kafkaService.createConsumer('tracks-group');
		await consumer.connect();
		await consumer.subscribe({ topic: TOPICS.request, fromBeginning: false });

		const producer = this.kafkaService.createProducer();
		await producer.connect();

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString()) as KafkaResponse;
				console.log(value);
				const result = await this.composite.use(value.func, value.message);
				producer.send({
					topic: TOPICS.response,
					messages: [
						{
							value: JSON.stringify({
								// TODO: Убрать возврат func в возврате
								func: value.func,
								id: value.id,
								message: result,
							} satisfies KafkaResponse),
						},
					],
				});
			},
		});
	};
}
