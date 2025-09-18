// import dotenv from 'dotenv';
// dotenv.config();
// import { rootContainer } from '../../containers/container.di';
// import { COMMON_TYPES } from '../../containers/TYPES.di';
// import { KafkaService } from '../../common/services/kafka/kafka.service';
// import { FUNKS, TOPICS } from '../common/CONST';
// import { Producer } from 'kafkajs';

// export interface KafkaResponse {
// 	id: string;
// 	func: string;
// 	message: any;
// }

// const producerSend = (producer: Producer, data: KafkaResponse) => {
// 	producer.send({
// 		topic: TOPICS.response,
// 		messages: [
// 			{
// 				value: JSON.stringify(data),
// 			},
// 		],
// 	});
// };

// (async () => {
// 	const kafkaService = rootContainer.get<KafkaService>(
// 		COMMON_TYPES.services.kafka,
// 	);
// 	const consumer = kafkaService.createConsumer('tracks-group');
// 	await consumer.connect();
// 	await consumer.subscribe({ topic: TOPICS.request, fromBeginning: false });

// 	const producer = kafkaService.createProducer();
// 	producer.connect();

// 	await consumer.run({
// 		eachMessage: async ({ message }) => {
// 			const value = JSON.parse(message.value!.toString()) as KafkaResponse;
// 			console.log(value);
// 			const strategy = getStrategy(value.func);

// 			switch (value.func) {
// 				case FUNKS.get123:
// 					producerSend(producer, {
// 						...value,
// 						message: `123: ${value.message}`,
// 					});
// 					break;
// 				case FUNKS.auth:
// 					producerSend(producer, {
// 						...value,
// 						message: `auth: ${value.message}`,
// 					});
// 					break;
// 				case FUNKS.paper:
// 					producerSend(producer, {
// 						...value,
// 						message: `paper: ${value.message}`,
// 					});
// 					break;
// 			}
// 		},
// 	});
// })();
