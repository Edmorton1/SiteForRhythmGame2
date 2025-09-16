import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';

(async () => {
	const consumer = new KafkaConsumer(
		['host.docker.internal:9092'],
		'service',
		'test-group',
	);
	await consumer.connect('test-topic');
	await consumer.run(async ({ message }) => {
		console.log(message.value?.toString());
	});
})().catch(console.error);
