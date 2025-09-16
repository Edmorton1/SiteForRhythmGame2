import { KafkaProducer } from '../common/services/kafka/kafka.producer';

(async () => {
	const kafkaProducer = new KafkaProducer(
		['host.docker.internal:9092'],
		'api-gateway',
	);
	await kafkaProducer.connect();
	await kafkaProducer.send('test-topic', [
		{ value: 'Hello from API-Gateway!' },
	]);
})().catch(console.error);
