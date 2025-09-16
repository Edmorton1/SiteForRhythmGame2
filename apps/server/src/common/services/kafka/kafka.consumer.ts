import { Kafka, type Consumer } from 'kafkajs';

export class KafkaConsumer {
	private readonly kafka: Kafka;
	private readonly consumer: Consumer;

	constructor(brokers: string[], clientId: string, groupId: string) {
		this.kafka = new Kafka({ clientId, brokers });
		this.consumer = this.kafka.consumer({ groupId });
	}

	async connect(topic: string, fromBeginning = true) {
		await this.consumer.connect();
		await this.consumer.subscribe({ topic, fromBeginning });
	}

	async run(
		eachMessage: (payload: {
			topic: string;
			partition: number;
			message: { offset: string; value: Buffer | null };
		}) => Promise<void>,
	) {
		await this.consumer.run({ eachMessage });
	}

	async disconnect() {
		await this.consumer.disconnect();
	}
}
