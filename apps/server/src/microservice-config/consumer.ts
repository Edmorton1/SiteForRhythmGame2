import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';

(async () => {
	const kafkaConsumer = new KafkaConsumer(
		['host.docker.internal:9092'],
		'service',
		'test-group',
	);
	await kafkaConsumer.connect('test-topic');
	await kafkaConsumer.run(async ({ message }) => {
		console.log(message.value?.toString());
	});
})().catch(console.error);
