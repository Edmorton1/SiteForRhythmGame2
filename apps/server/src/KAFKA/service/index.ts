import dotenv from 'dotenv';
dotenv.config();
import { rootContainer } from '../../containers/container.di';
import { COMMON_TYPES } from '../../containers/TYPES.di';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS } from '../common/CONST';

export interface KafkaResponse {
	id: string;
	func: string;
	message: any;
}

(async () => {
	const kafkaService = rootContainer.get<KafkaService>(
		COMMON_TYPES.services.kafka,
	);
	const consumer = kafkaService.createConsumer('tracks-group');
	await consumer.connect();
	await consumer.subscribe({ topic: TOPICS.request, fromBeginning: false });

	const producer = kafkaService.createProducer();
	producer.connect();

	await consumer.run({
		eachMessage: async ({ message }) => {
			const value = JSON.parse(message.value!.toString()) as KafkaResponse;
			console.log(value);

			switch (value.func) {
				case 'getValue':
					producer.send({
						topic: TOPICS.response,
						messages: [
							{
								value: JSON.stringify({
									message: 'tracksService.getValue()',
									id: value.id,
									func: 'getValue',
								}),
							},
						],
					});
			}
		},
	});
})();
