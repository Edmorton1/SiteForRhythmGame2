import { inject } from 'inversify';
import { WEB_TYPES } from '../../../web-server/container/TYPES.di';
import { KafkaService } from './kafka.service';
import { TOPICS } from '../../topics/TOPICS';
import { KafkaResponse } from '../../../microservices/config/types';
import EventEmitter from 'events';
import { Producer } from 'kafkajs';

const emitter = new EventEmitter();

export class KafkaController {
	producer?: Producer;

	constructor(
		@inject(WEB_TYPES.services.kafka)
		private readonly kafkaService: KafkaService,
	) {}

	sendMessage = (data: KafkaResponse): void => {
		if (!this.producer) throw new Error('ПРОДЮСЕР НЕ ЗАГРУЖЕН');
		this.producer.send({
			topic: TOPICS.request,
			messages: [{ value: JSON.stringify(data) }],
		});
	};

	sendAndWait = (data: KafkaResponse) => {
		this.sendMessage(data);

		return new Promise(res => emitter.once(data.id, result => res(result)));
	};

	startProducer = async () => {
		this.producer = this.kafkaService.createProducer();
		this.producer.connect();
	};

	startConsumer = async () => {
		const consumer = this.kafkaService.createConsumer('wu-tang');
		await consumer.connect();
		await consumer.subscribe({ topic: TOPICS.response });

		await consumer.run({
			eachMessage: async ({ message }) => {
				const value = JSON.parse(message.value!.toString()) as KafkaResponse;
				console.log(value);
				emitter.emit(value.id, value);
			},
		});
	};
}
