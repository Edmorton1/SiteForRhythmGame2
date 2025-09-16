import { NextFunction, Request, Response, Router } from 'express';
import type { Consumer, Producer } from 'kafkajs';
import { KafkaProducer } from '../common/services/kafka/kafka.producer';
import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';
import { randomUUID } from 'crypto';
import { injectable } from 'inversify';

interface ControllerRoute {
	path: string;
	handle: (req: Request, res: Response) => Promise<void> | void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: ((req: Request, res: Response, next: NextFunction) => any)[];
}

interface Ids {
	requestTopicId: string;
	responseTopicId: string;
	groupId: string;
}

export class BaseController {
	readonly router: Router;
	private producer!: Producer;
	private consumer!: Consumer;
	private readonly map = new Map<string, (value: unknown) => void>();
	// СДЕЛАТЬ АЙДИ ТОПИКОВ И КОНСЮМЕРОВ КАК СИМВОЛЫ
	private topics!: Ids;

	constructor() {
		this.router = Router();
	}

	protected init = (options: Ids) => {
		this.topics = options;
		this.createProducer();
		this.createConsumer();
	};

	protected bindRoutes(routes: ControllerRoute[]): void {
		for (const route of routes) {
			if (!route.middlewares?.length) route.middlewares = [];

			const pipeline = [...route.middlewares, route.handle];

			this.router[route.method](route.path, ...pipeline);
		}
	}

	protected sendAndWait = async (data: unknown): Promise<unknown> => {
		const id = randomUUID();

		const response = new Promise(res => {
			this.map.set(id, res);
		});

		await this.producer.send({
			topic: 'request-topic',
			messages: [{ value: JSON.stringify({ message: data, id }) }],
		});

		return await response;
	};

	protected sendAndForget = (data: unknown): void => {
		this.producer.send({
			topic: 'request-topic',
			messages: [
				{ value: JSON.stringify({ message: data, id: 'TODO: REMOVE' }) },
			],
		});
	};

	private createProducer = () => {
		this.producer = new KafkaProducer(
			['host.docker.internal:9092'],
			'service',
		).producer;

		(async () => {
			await this.producer.connect();
		})();
	};

	private createConsumer = () => {
		this.consumer = new KafkaConsumer(
			['host.docker.internal:9092'],
			'service',
			'response-group',
		).consumer;

		(async () => {
			await this.consumer.connect();
			await this.consumer.subscribe({
				topic: 'response-topic',
				fromBeginning: true,
			});
			this.consumer.run({
				eachMessage: async ({ topic, partition, message }) => {
					const value = JSON.parse(message.value!.toString());
					console.log('Ответ получен:', value);
					const resolve = this.map.get(value.id);
					this.map.delete(value.id);
					resolve!(value.message);
				},
			});
		})();
	};
}

// import { NextFunction, Request, Response, Router } from 'express';

// interface IControllerRoute {
// 	path: string;
// 	handle: (req: Request, res: Response) => Promise<void> | void;
// 	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
// 	middlewares?: ((req: Request, res: Response, next: NextFunction) => any)[];
// }

// export class BaseController {
// 	readonly router: Router;
// 	constructor() {
// 		this.router = Router();
// 	}

// 	protected bindRoutes(routes: IControllerRoute[]): void {
// 		for (const route of routes) {
// 			if (!route.middlewares?.length) route.middlewares = [];

// 			const pipeline = [...route.middlewares, route.handle];

// 			this.router[route.method](route.path, ...pipeline);
// 		}
// 	}
// }
