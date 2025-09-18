import { inject, injectable } from 'inversify';
import { COMMON_TYPES } from '../../../containers/TYPES.di';
import { ConfigService } from '../config/config.service';
import { Kafka } from 'kafkajs';

@injectable()
export class KafkaService {
	private readonly kafka: Kafka;
	// consumer: Consumer;

	constructor(
		@inject(COMMON_TYPES.services.config)
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
}

// import { Kafka, type Consumer, type Producer } from 'kafkajs';

// export class KafkaService {
// 	private readonly kafka: Kafka;
// 	private readonly producer: Producer;
// 	private readonly consumer: Consumer;

// 	constructor() {
// 		this.kafka = new Kafka({
// 			clientId: 'my-app',
// 			brokers: ['host.docker.internal:9092'],
// 		});
// 		this.producer = this.kafka.producer();
// 		this.consumer = this.kafka.consumer({ groupId: 'test-group' });
// 	}

// 	async start() {
// 		// Producing
// 		await this.producer.connect();
// 		await this.producer.send({
// 			topic: 'test-topic',
// 			messages: [{ value: 'Hello KafkaJS user!' }],
// 		});

// 		// Consuming
// 		await this.consumer.connect();
// 		await this.consumer.subscribe({ topic: 'test-topic', fromBeginning: true });

// 		await this.consumer.run({
// 			eachMessage: async ({ topic, partition, message }) => {
// 				console.log({
// 					partition,
// 					offset: message.offset,
// 					value: message.value?.toString(),
// 				});
// 			},
// 		});
// 	}
// }
