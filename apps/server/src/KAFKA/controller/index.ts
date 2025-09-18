import dotenv from 'dotenv';
dotenv.config();
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { rootContainer } from '../../containers/container.di';
import { COMMON_TYPES } from '../../containers/TYPES.di';
import { TOPICS } from '../common/CONST';
import { randomUUID } from 'crypto';
import { EventEmitter } from 'stream';
import { KafkaResponse } from '../service/server.microservice';

// Проблема этого метода в том, что если сделать вызов до того как один из двух процессов запустится будут баги
// В мап поставить callback

// нужно чтобы контроллер возвращал колбек вместо
const emitter = new EventEmitter();

emitter.on('callback', msg => {
	console.log('Сообщение получено', msg);
	return msg;
});

const waitEmit = async () => {
	return new Promise(res => {
		return emitter.once('callback', res);
	});
};

(async () => {
	const kafkaService = rootContainer.get<KafkaService>(
		COMMON_TYPES.services.kafka,
	);
	const consumer = kafkaService.createConsumer('wu-tang');
	await consumer.connect();
	await consumer.subscribe({ topic: TOPICS.response });

	await consumer.run({
		eachMessage: async ({ message }) => {
			const value = JSON.parse(message.value!.toString()) as KafkaResponse;
			// console.log(value);
			emitter.emit('callback', value);
			if (value.func === 'getValue') {
				console.log('RES JSON', value.message);
			}
		},
	});

	const producer = kafkaService.createProducer();
	await producer.connect();

	const id = randomUUID();

	producer.send({
		topic: TOPICS.request,
		messages: [
			{
				value: JSON.stringify({
					message: 'MESSAGE ATTENTION',
					id,
					func: 'getValue',
				} satisfies KafkaResponse),
			},
		],
	});

	const response = await waitEmit();
	console.log('Никого не ждём', response);
})();
