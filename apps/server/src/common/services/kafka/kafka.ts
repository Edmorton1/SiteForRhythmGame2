import { Kafka, type Consumer, type Producer } from 'kafkajs';

export class KafkaService {
	private readonly kafka: Kafka;
	private readonly producer: Producer;
	private readonly consumer: Consumer;

	constructor() {
		this.kafka = new Kafka({
			clientId: 'my-app',
			brokers: ['host.docker.internal:9092'],
		});
		this.producer = this.kafka.producer();
		this.consumer = this.kafka.consumer({ groupId: 'test-group' });
	}

	async start() {
		// Producing
		await this.producer.connect();
		await this.producer.send({
			topic: 'test-topic',
			messages: [{ value: 'Hello KafkaJS user!' }],
		});

		// Consuming
		await this.consumer.connect();
		await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

		await this.consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				console.log({
					partition,
					offset: message.offset,
					value: message.value?.toString(),
				});
			},
		});
	}
}
