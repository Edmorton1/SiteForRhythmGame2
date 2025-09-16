import { KafkaConsumer } from '../../../common/services/kafka/kafka.consumer';
import { KafkaProducer } from '../../../common/services/kafka/kafka.producer';

(async () => {
	const consumer = new KafkaConsumer(
		['host.docker.internal:9092'],
		'service',
		'test-group',
	).consumer;
	const producer = new KafkaProducer(['host.docker.internal:9092'], 'service')
		.producer;

	await producer.connect();

	await consumer.connect();
	await consumer.subscribe({ topic: 'request-topic', fromBeginning: true });

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
