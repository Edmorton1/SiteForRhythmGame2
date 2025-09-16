import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';
import { KafkaProducer } from '../common/services/kafka/kafka.producer';

const consumer = new KafkaConsumer(
	['host.docker.internal:9092'],
	'api-gateway',
	'test-group',
);

// const producer = new KafkaProducer(
// 	['host.docker.internal:9092'],
// 	'api-gateway',
// );

(async () => {
	await consumer.connect('test-topic');
	await consumer.run(async ({ message }) => {
		console.log(message.value?.toString());

		// await producer.connect();
		// await producer.send('reply-topic', [{ value: 'asdasdasdasd' }]);
	});
})().catch(console.error);
