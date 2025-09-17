import { KafkaConsumer } from '../../../common/services/kafka/kafka.consumer';
import { KafkaProducer } from '../../../common/services/kafka/kafka.producer';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
	const consumer = new KafkaConsumer(
		[process.env['KAFKA_BROKERS']!],
		'service',
		'test-group',
	).consumer;
	const producer = new KafkaProducer([process.env['KAFKA_BROKERS']!], 'service')
		.producer;

	await producer.connect();

	await consumer.connect();
	await consumer.subscribe({ topic: 'request-topic', fromBeginning: false });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const value = JSON.parse(message.value!.toString());
			console.log('Получено сообщение:', value);

			await producer.send({
				topic: 'response-topic',
				messages: [
					{
						value: JSON.stringify({
							message: `Ответ на: ${value.message}`,
							id: value.id,
						}),
					},
				],
			});
		},
	});
})().catch(console.error);
