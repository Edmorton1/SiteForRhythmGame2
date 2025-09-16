import { Kafka, type Producer } from 'kafkajs';

export class KafkaProducer {
	kafka: Kafka;
	producer: Producer;

	constructor(brokers: string[], clientId: string) {
		this.kafka = new Kafka({ clientId, brokers });
		this.producer = this.kafka.producer();
	}

	// async connect() {
	// 	await this.producer.connect();
	// }

	// async send() {
	// 	await this.producer.send();
	// }

	// async disconnect() {
	// 	await this.producer.disconnect();
	// }
}
