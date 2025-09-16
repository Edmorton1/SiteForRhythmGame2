import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { KafkaProducer } from '../../../common/services/kafka/kafka.producer';
import { KafkaConsumer } from '../../../common/services/kafka/kafka.consumer';
import { randomUUID } from 'crypto';

const producer = new KafkaProducer(['host.docker.internal:9092'], 'service')
	.producer;

const consumer = new KafkaConsumer(
	['host.docker.internal:9092'],
	'service',
	'response-group',
).consumer;

const map = new Map<string, (value: unknown) => void>();

(async () => {
	await consumer.connect();
	await consumer.subscribe({
		topic: 'response-topic',
		fromBeginning: true,
	});
	consumer.run({
		eachMessage: async ({ topic, partition, message }) => {
			const value = JSON.parse(message.value!.toString());
			console.log('Ответ получен:', value);
			const resolve = map.get(value.id);
			map.delete(value.id);
			resolve!(value.message);
		},
	});
})();

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
		const id = randomUUID();

		const response = new Promise(res => {
			map.set(id, res);
		});

		await producer.connect();

		await producer.send({
			topic: 'request-topic',
			messages: [
				{ value: JSON.stringify({ message: 'Hello from API-Gateway!', id }) },
			],
		});

		console.log(await response);
		res.json({ 'from reply': await response });
	};
}

// import { Request, Response } from 'express';
// import { injectable } from 'inversify';
// import { BaseController } from '../../../config/base.controller';
// import { serverPaths } from '../../../../../../libs/shared/PATHS';
// import { KafkaProducer } from '../../../common/services/kafka/kafka.producer';
// import { KafkaConsumer } from '../../../common/services/kafka/kafka.consumer';
// import { randomUUID } from 'crypto';

// const producer = new KafkaProducer(['host.docker.internal:9092'], 'service')
// 	.producer;

// const consumer = new KafkaConsumer(
// 	['host.docker.internal:9092'],
// 	'service',
// 	'response-group',
// ).consumer;

// const map = new Map<string, () => string>();

// consumer.run({
// 	eachMessage: async ({ topic, partition, message }) => {
// 		const value = message.value?.toString();
// 		console.log('Ответ получен:', value);
// 	},
// });

// @injectable()
// export class TracksController extends BaseController {
// 	constructor() {
// 		super();
// 		this.bindRoutes([
// 			{
// 				handle: this.handle,
// 				method: 'get',
// 				path: serverPaths.tracks,
// 			},
// 		]);
// 	}

// 	handle = async (req: Request, res: Response) => {
// 		const id = randomUUID();

// 		await producer.connect();

// 		await consumer.connect();
// 		await consumer.subscribe({ topic: 'response-topic', fromBeginning: true });

// 		let asd;
// 		await consumer.run({
// 			eachMessage: async ({ topic, partition, message }) => {
// 				const value = JSON.parse(message.value!.toString());
// 				asd = value;
// 				console.log('Ответ получен:', value);
// 			},
// 		});

// 		await producer.send({
// 			topic: 'request-topic',
// 			messages: [
// 				{ value: JSON.stringify({ message: 'Hello from API-Gateway!', id }) },
// 			],
// 		});

// 		await new Promise(res =>
// 			setTimeout(() => {
// 				res(undefined);
// 			}, 1500),
// 		);

// 		console.log(asd);
// 		res.json({ 'from reply': asd });
// 	};
// }
