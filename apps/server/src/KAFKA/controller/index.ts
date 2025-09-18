import dotenv from 'dotenv';
dotenv.config();
import { KafkaService } from '../../common/services/kafka/kafka.service';
import { rootContainer } from '../../containers/container.di';
import { COMMON_TYPES } from '../../containers/TYPES.di';
import { TOPICS } from '../common/CONST';
import { KafkaResponse } from '../service';
import { randomUUID } from 'crypto';

// Проблема этого метода в том, что если сделать вызов до того как один из двух процессов запустится будут баги
// В мап поставить callback

// нужно чтобы контроллер возвращал колбек вместо

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
			console.log(value);
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
	// пускай я хочу в ответ на сообщение вывести лог RES JSON
})();
