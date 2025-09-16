import { KafkaProducer } from '../common/services/kafka/kafka.producer';

(async () => {
	const producer = new KafkaProducer(
		['host.docker.internal:9092'],
		'api-gateway',
	);
	await producer.connect();
	await producer.send('test-topic', [{ value: 'Hello from API-Gateway!' }]);
})().catch(console.error);
