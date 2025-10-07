import { inject, injectable } from 'inversify';
import { ConfigAdapter } from '../config/config.adapter';
import { Kafka } from 'kafkajs';
import { ADAPTERS } from '../container/adapters.types';

@injectable()
export class KafkaAdapter {
	private readonly kafka: Kafka;

	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
	) {
		const brokers = this.config.getEnv('KAFKA_BROKERS').split(',');
		const clientId = this.config.getEnv('KAFKA_CLIENT_ID');
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
}
