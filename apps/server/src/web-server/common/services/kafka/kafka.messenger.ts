import { type TopicsRequest } from '../../../../common/topics/TOPICS';
import { randomUUID } from 'crypto';
import { HttpError } from '../../../../common/http/http.error';
// prettier-ignore
import { KafkaError, KafkaRequest, KafkaResponse } from '../../../../common/adapters/kafka/kafka.types';
import { inject, injectable } from 'inversify';
import { kafkaEmitter, KafkaLoader } from '../../../config/kafka/kafka.loader';
import { WEB } from '../../../container/web.di';

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

export type BASE_FUNCTIONS = Record<string, { input: any; output: any }>;

@injectable()
export class KafkaMessenger {
	constructor(
		@inject(WEB.app.KafkaLoader)
		private readonly kafkaLoader: KafkaLoader,
	) {}

	private sendMessage = (data: KafkaRequest, topic: TopicsRequest): void => {
		if (!this.kafkaLoader.producer) throw new Error('ПРОДЮСЕР НЕ ЗАГРУЖЕН');
		this.kafkaLoader.producer.send({
			topic,
			messages: [{ value: JSON.stringify(data) }],
		});
	};

	private sendAndWait: Sender<false> = (data, topic) => {
		const id = randomUUID();
		this.sendMessage({ ...data, id }, topic);

		return new Promise((res, rej) =>
			kafkaEmitter.once(id, (result: KafkaResponse | KafkaError) => {
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
}
