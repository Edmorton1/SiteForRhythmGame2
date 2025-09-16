import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { KafkaProducer } from '../../../common/services/kafka/kafka.producer';
import { KafkaConsumer } from '../../../common/services/kafka/kafka.consumer';

// const producer = new KafkaProducer(['host.docker.internal:9092'], 'api-gateway')
// 	.producer;

// let isProducerConnected = false;

// const connectProducer = async () => {
// 	if (isProducerConnected) {
// 		return;
// 	}
// 	await producer.connect();
// 	isProducerConnected = true;
// };

// const consumer = new KafkaConsumer(
// 	['host.docker.internal:9092'],
// 	'service',
// 	'test-group',
// ).consumer;

@injectable()
export class TracksController extends BaseController {
	constructor() {
		super();
		this.bindRoutes([
			{
				handle: this.handle,
				method: 'get',
				path: serverPaths.tracks,
			},
		]);
	}

	handle = async (req: Request, res: Response) => {
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

		res.json({ 'from reply': 'response' });
	};
}
