import { Kafka, type Producer } from 'kafkajs';

export class KafkaProducer {
	private readonly kafka: Kafka;
	private readonly producer: Producer;

	constructor(brokers: string[], clientId: string) {
		this.kafka = new Kafka({ clientId, brokers });
		this.producer = this.kafka.producer();
	}

	async connect() {
		await this.producer.connect();
	}

	async send(topic: string, messages: { value: string }[]) {
		await this.producer.send({ topic, messages });
	}

	async disconnect() {
		await this.producer.disconnect();
	}
}
