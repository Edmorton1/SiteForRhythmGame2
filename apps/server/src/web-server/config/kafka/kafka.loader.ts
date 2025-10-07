import { inject } from 'inversify';
import { KafkaAdapter } from '../../../common/adapters/kafka/kafka.adapter';
import { TOPICS } from '../../../common/topics/TOPICS';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';

// TODO: ЗАВТРА УБРАТЬ ДУБЛИРОВАНИЕ
export const kafkaEmitter = new EventEmitter();

export class KafkaLoader {
	producer?: Producer;

	constructor(
		@inject(ADAPTERS.common.kafka)
		private readonly kafkaAdapter: KafkaAdapter,
	) {}

	private startProducer = async () => {
		this.producer = this.kafkaAdapter.createProducer();
		await this.producer.connect();
	};

	// TODO: Пофиксить: Он подхватывает старые сообщения и пытается вызывать их в функции, которой нет
	private startConsumer = async () => {
		const consumer = this.kafkaAdapter.createConsumer('web-server-groupId');
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
