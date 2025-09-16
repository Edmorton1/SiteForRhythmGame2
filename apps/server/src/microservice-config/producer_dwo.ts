import { KafkaProducer } from '../common/services/kafka/kafka.producer';
import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';

(async () => {
	const producer = new KafkaProducer(['host.docker.internal:9092'], 'service')
		.producer;
	await producer.connect();

	const consumer = new KafkaConsumer(
		['host.docker.internal:9092'],
		'service',
		'response-group',
	).consumer;

	await consumer.connect();
	await consumer.subscribe({ topic: 'response-topic', fromBeginning: true });

	await consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const value = message.value?.toString();
			console.log('Ответ получен:', value);
		},
	});

	await producer.send({
		topic: 'request-topic',
		messages: [{ value: 'Hello from API-Gateway!' }],
	});
})().catch(console.error);
