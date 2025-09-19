import { inject, injectable } from 'inversify';
import { WEB_TYPES } from '../../../web-server/container/TYPES.di';
import { ConfigService } from '../config/config.service';
import { Kafka } from 'kafkajs';

@injectable()
export class KafkaService {
	private readonly kafka: Kafka;

	constructor(
		@inject(WEB_TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		const brokers = this.configService.getEnv('KAFKA_BROKERS').split(',');
		const clientId = this.configService.getEnv('KAFKA_CLIENT_ID');
		this.kafka = new Kafka({ clientId, brokers });
	}

	createProducer = () => {
		return this.kafka.producer();
	};

	createConsumer = (groupId: string) => {
		return this.kafka.consumer({
			groupId,
			sessionTimeout: 8000,
			heartbeatInterval: 3000,
		});
	};

	// producerSend = (producer: Producer, data: any) => {
	// 	producer.send({
	// 		topic: TOPICS.response,
	// 		messages: [
	// 			{
	// 				value: JSON.stringify(data),
	// 			},
	// 		],
	// 	});
	// };
}
