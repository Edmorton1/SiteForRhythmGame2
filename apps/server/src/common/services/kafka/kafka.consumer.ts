import { Kafka, type Consumer } from 'kafkajs';

export class KafkaConsumer {
	kafka: Kafka;
	consumer: Consumer;

	constructor(brokers: string[], clientId: string, groupId: string) {
		this.kafka = new Kafka({ clientId, brokers });
		this.consumer = this.kafka.consumer({
			groupId,
			sessionTimeout: 30000,
			heartbeatInterval: 10000,
		});
	}
}
