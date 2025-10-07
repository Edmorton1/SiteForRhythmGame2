import { inject } from 'inversify';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS } from '../../common/topics/TOPICS';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';

// TODO: ЗАВТРА УБРАТЬ ДУБЛИРОВАНИЕ
export const kafkaEmitter = new EventEmitter();

export class KafkaWebServer {
	producer?: Producer;

	constructor(
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	private startProducer = async () => {
		this.producer = this.kafkaService.createProducer();
		await this.producer.connect();
	};

	// TODO: Пофиксить: Он подхватывает старые сообщения и пытается вызывать их в функции, которой нет
	private startConsumer = async () => {
		const consumer = this.kafkaService.createConsumer('web-server-groupId');
		await consumer.connect();
		await consumer.subscribe({
			topics: [TOPICS.response.auth, TOPICS.response.tracks],
			fromBeginning: false,
		});

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString());
				kafkaEmitter.emit(value.id, value);
			},
		});
	};

	startKafka = async () => {
		await this.startProducer();
		await this.startConsumer();
	};
}
