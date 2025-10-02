import { inject } from 'inversify';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS, type TopicsRequest } from '../../common/topics/TOPICS';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import { randomUUID } from 'crypto';
import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';
import { HttpError } from '../../common/http/http.error';
import { KafkaResponse } from '../../common/services/kafka/kafka.types';

const emitter = new EventEmitter();

export class KafkaWebServer {
	private producer?: Producer;

	constructor(
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	private sendMessage = (data: KafkaResponse, topic: TopicsRequest): void => {
		if (!this.producer) throw new Error('ПРОДЮСЕР НЕ ЗАГРУЖЕН');
		this.producer.send({
			topic,
			messages: [{ value: JSON.stringify(data) }],
		});
	};

	sendAndWait = <T>(
		data: Omit<KafkaResponse, 'id'>,
		topic: TopicsRequest,
	): Promise<T> => {
		const id = randomUUID();
		this.sendMessage({ ...data, id }, topic);

		return new Promise((res, rej) =>
			emitter.once(id, (result: KafkaResponse) => {
				if (result.status === 'error') {
					rej(new HttpError(result.message.statusCode, result.message.message));
					return;
				}
				console.log('ПОЛОЖИТЕЛЬНЫЙ ОТВЕТ', result.message);
				res(result.message);
			}),
		);
	};

	startProducer = async () => {
		this.producer = this.kafkaService.createProducer();
		this.producer.connect();
	};

	// TODO: Пофиксить: Он подхватывает старые сообщения и пытается вызывать их в функции, которой нет
	startConsumer = async () => {
		const consumer = this.kafkaService.createConsumer('web-server-groupId');
		await consumer.connect();
		await consumer.subscribe({
			topics: [TOPICS.response.auth, TOPICS.response.tracks],
			fromBeginning: false,
		});

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString()) as KafkaResponse;
				console.log('ОТВЕТ МИКРОСЕРВИСА', value);
				emitter.emit(value.id, value);
			},
		});
	};
}
