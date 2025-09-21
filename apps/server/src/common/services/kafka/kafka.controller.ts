import { inject } from 'inversify';
import { KafkaService } from './kafka.service';
import { TOPICS } from '../../topics/TOPICS';
import { KafkaResponse } from '../../../microservices/config/types';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import { randomUUID } from 'crypto';
import { SERVICES_TYPES } from '../../containers/SERVICES_TYPES.di';

const emitter = new EventEmitter();

export class KafkaController {
	private producer?: Producer;

	constructor(
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	private sendMessage = (data: KafkaResponse): void => {
		if (!this.producer) throw new Error('ПРОДЮСЕР НЕ ЗАГРУЖЕН');
		this.producer.send({
			topic: TOPICS.request,
			messages: [{ value: JSON.stringify(data) }],
		});
	};

	sendAndWait = <T>(data: Omit<KafkaResponse, 'id'>): Promise<T> => {
		const id = randomUUID();
		this.sendMessage({ ...data, id });

		return new Promise(res =>
			emitter.once(id, (result: KafkaResponse) => res(result.message)),
		);
	};

	startProducer = async () => {
		this.producer = this.kafkaService.createProducer();
		this.producer.connect();
	};

	// TODO: Пофиксить: Он подхватывает старые сообщения и пытается вызывать их в функции, которой нет
	startConsumer = async () => {
		const consumer = this.kafkaService.createConsumer('wu-tang');
		await consumer.connect();
		await consumer.subscribe({ topic: TOPICS.response, fromBeginning: false });

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString()) as KafkaResponse;
				console.log(value);
				emitter.emit(value.id, value);
			},
		});
	};
}
