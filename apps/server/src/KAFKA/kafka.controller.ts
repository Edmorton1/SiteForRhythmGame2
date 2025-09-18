import { inject, injectable } from 'inversify';
import type { Producer } from 'kafkajs';
import { KafkaService } from '../common/services/kafka/kafka.service';
import { COMMON_TYPES } from '../containers/TYPES.di';
import { randomUUID } from 'crypto';

export interface Ids {
	requestTopicId: string;
	responseTopicId: string;
	groupId: string;
}

@injectable()
export class KafkaController {
	private producer!: Producer;
	private readonly map = new Map<string, (value: unknown) => void>();
	// СДЕЛАТЬ АЙДИ ТОПИКОВ И КОНСЮМЕРОВ КАК СИМВОЛЫ

	constructor(
		@inject(COMMON_TYPES.services.kafka)
		private readonly kafkaService: KafkaService,
		private readonly options: Ids,
	) {
		(async () => {
			this.producer = await this.createProducer();
			await this.createConsumer();
		})();
	}

	sendAndWait = async (data: unknown): Promise<unknown> => {
		const id = randomUUID();

		console.log(id, this.map);
		const response = new Promise(res => {
			this.map.set(id, res);
		});

		await this.producer.send({
			topic: this.options.requestTopicId,
			messages: [
				// TODO: ХАРДКОД
				{ value: JSON.stringify({ message: data, id, func: 'getValue' }) },
			],
		});

		return await response;
	};

	sendAndForget = async (data: unknown): Promise<void> => {
		this.producer.send({
			topic: this.options.requestTopicId,
			messages: [
				{ value: JSON.stringify({ message: data, id: 'TODO: REMOVE' }) },
			],
		});
	};

	private createProducer = async () => {
		const producer = this.kafkaService.createProducer();

		await producer.connect();
		return producer;
	};

	private createConsumer = async () => {
		console.log('CREATE CONSUMER');
		const consumer = this.kafkaService.createConsumer(this.options.groupId);

		await consumer.connect();

		await consumer.subscribe({
			topic: this.options.responseTopicId,
			fromBeginning: false,
		});
		consumer.run({
			eachMessage: async ({ message }) => {
				console.log('ЧЁ ПАРСИМ', message.value!.toString());
				const value = JSON.parse(message.value!.toString());
				console.log('Ответ получен:', value);
				const resolve = this.map.get(value.id);
				this.map.delete(value.id);
				if (!resolve) {
					throw new Error('RESOLVE НЕ НАЙДЕН');
				}
				resolve(value.message);
			},
		});

		return consumer;
	};
}
