import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { EventEmitter } from 'stream';
import { rootContainer } from '../../containers/container.di';
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { COMMON_TYPES } from '../../containers/TYPES.di';
import { FUNKS, TOPICS } from '../common/CONST';
import { KafkaResponse } from '../service';
import { randomUUID } from 'crypto';
import { Producer } from 'kafkajs';

const emitter = new EventEmitter();

let producer: Producer;

const producerSend = async (data: KafkaResponse) => {
	producer.send({
		topic: TOPICS.request,
		messages: [{ value: JSON.stringify(data) }],
	});
};

const waitForEmit = async (id: string) =>
	new Promise(res => emitter.once(id, msg => res(msg)));

// ------------ KAFKA ------------
const kafkaService = rootContainer.get<KafkaService>(
	COMMON_TYPES.services.kafka,
);

(async () => {
	const producer_timely = kafkaService.createProducer();
	await producer_timely.connect();
	producer = producer_timely;
})();

const createConsumer = async () => {
	const consumer = kafkaService.createConsumer('wu-tang');
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
// ------------ KAFKA ------------

(async () => {
	const app = express();

	await createConsumer();

	app.get('/test', async (req, res) => {
		const id = randomUUID();
		const message = { message: 'MESSAGE ATTENTION', id, func: FUNKS.get123 };

		producerSend(message);
		const response = await waitForEmit(id);
		res.json(response);
	});

	app.listen(3000, '0.0.0.0', () => {
		console.log('TEST SERVER STARTED');
	});
})();

// Осталась одна проблема. Если будет несколько инстансов API-GATEWAY, тогда
// один из них может забрать ненужный ему запрос и данные пропадут
