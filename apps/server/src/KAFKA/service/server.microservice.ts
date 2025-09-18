import { inject, injectable } from 'inversify';
import { MICRO_TYPES } from './TYPES.di';
import { ServiceComposite } from './service.composite';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS } from '../common/CONST';
import { IFUNCS } from './server.instance';

export interface KafkaResponse {
	id: string;
	func: IFUNCS;
	message: any;
}

@injectable()
export class ServerMicroservice {
	constructor(
		@inject(MICRO_TYPES.microApp.composite)
		private readonly composite: ServiceComposite,
		@inject(MICRO_TYPES.services.kafka)
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
