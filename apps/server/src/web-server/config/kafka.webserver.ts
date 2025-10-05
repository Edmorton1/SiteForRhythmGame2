import { inject } from 'inversify';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { TOPICS, type TopicsRequest } from '../../common/topics/TOPICS';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';
import { randomUUID } from 'crypto';
import { SERVICES_TYPES } from '../../common/containers/SERVICES_TYPES.di';
import { HttpError } from '../../common/http/http.error';
// prettier-ignore
import { KafkaError, KafkaRequest, KafkaResponse } from '../../common/services/kafka/kafka.types';

// TODO: ЗАВТРА УБРАТЬ ДУБЛИРОВАНИЕ
const emitter = new EventEmitter();

export type BASE_FUNCTIONS = Record<string, { input: any; output: any }>;

type Sender<V extends boolean> = <
	T extends BASE_FUNCTIONS,
	F extends Extract<keyof T, string>,
>(
	data: { func: F; message: T[F]['input'] },
	topic: TopicsRequest,
) => V extends true ? void : Promise<T[F]['output']>;

export type KafkaSender<T extends BASE_FUNCTIONS> = {
	sendAndWait: <F extends Extract<keyof T, string>>(
		data: { func: F; message: T[F]['input'] },
		topic: TopicsRequest,
	) => Promise<T[F]['output']>;

	sendAndForget: <F extends Extract<keyof T, string>>(
		data: { func: F; message: T[F]['input'] },
		topic: TopicsRequest,
	) => void;
};

export class KafkaWebServer {
	private producer?: Producer;

	constructor(
		@inject(SERVICES_TYPES.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	private sendMessage = (data: KafkaRequest, topic: TopicsRequest): void => {
		if (!this.producer) throw new Error('ПРОДЮСЕР НЕ ЗАГРУЖЕН');
		this.producer.send({
			topic,
			messages: [{ value: JSON.stringify(data) }],
		});
	};

	private sendAndWait: Sender<false> = (data, topic) => {
		const id = randomUUID();
		this.sendMessage({ ...data, id }, topic);

		return new Promise((res, rej) =>
			emitter.once(id, (result: KafkaResponse | KafkaError) => {
				if (result.status === 'error') {
					rej(new HttpError(result.message.statusCode, result.message.message));
					return;
				}
				// console.log('ПОЛОЖИТЕЛЬНЫЙ ОТВЕТ', result.message);
				res(result.message);
			}),
		);
	};

	private sendAndForget: Sender<true> = (data, topic): void => {
		// TODO: Пока не было необходимости в запросе без ожидания. Когда будет сделать
		// @ts-ignore
		this.sendMessage({ ...data }, topic);
	};

	initSender = <T extends BASE_FUNCTIONS>(): KafkaSender<T> => {
		return {
			sendAndWait: <F extends Extract<keyof T, string>>(
				data: { func: F; message: T[F]['input'] },
				topic: TopicsRequest,
			): Promise<T[F]['output']> => this.sendAndWait<T, F>(data, topic),

			sendAndForget: <F extends Extract<keyof T, string>>(
				data: { func: F; message: T[F]['input'] },
				topic: TopicsRequest,
			): void => this.sendAndForget(data, topic),
		};
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
				const value = JSON.parse(message.value!.toString());
				// console.log('ОТВЕТ МИКРОСЕРВИСА', value);
				emitter.emit(value.id, value);
			},
		});
	};
}
