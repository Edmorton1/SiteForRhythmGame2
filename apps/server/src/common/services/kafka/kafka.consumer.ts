import { Kafka, type Consumer } from 'kafkajs';

export class KafkaConsumer {
	kafka: Kafka;
	consumer: Consumer;

	constructor(brokers: string[], clientId: string, groupId: string) {
		this.kafka = new Kafka({ clientId, brokers });
		this.consumer = this.kafka.consumer({
			groupId,
			sessionTimeout: 8000,
			heartbeatInterval: 3000,
		});
	}

	// async connect(topic: string, fromBeginning = true) {
	// 	await this.consumer.connect();
	// 	await this.consumer.subscribe({ topic, fromBeginning });
	// }

	// async run(
	// 	eachMessage: (payload: {
	// 		topic: string;
	// 		partition: number;
	// 		message: { offset: string; value: Buffer | null };
	// 	}) => Promise<void>,
	// ) {
	// 	await this.consumer.run({ eachMessage });
	// }

	// async disconnect() {
	// 	await this.consumer.disconnect();
	// }
}
