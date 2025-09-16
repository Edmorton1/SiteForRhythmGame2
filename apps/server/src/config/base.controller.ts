import { NextFunction, Request, Response, Router } from 'express';
import type { Consumer, Producer } from 'kafkajs';
import { KafkaProducer } from '../common/services/kafka/kafka.producer';
import { KafkaConsumer } from '../common/services/kafka/kafka.consumer';
import { randomUUID } from 'crypto';
import { injectable } from 'inversify';
import { COMMON_TYPES } from '../containers/TYPES.di';
import { KafkaService } from '../common/services/kafka/kafka.service';
import { rootContainer } from '../containers/container.di';

// https://chatgpt.com/c/68c96218-03cc-832e-928d-340e9ce0fe44
// bootstrap.ts
// const tracks = container.get(TracksController);
// await tracks.init({
//   groupId: 'tracks-service-group',
//   requestTopicId: 'request-topic',
//   responseTopicId: 'response-topic',
// });
// app.use(tracks.router);
// await app.listen(...);

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

@injectable()
export class BaseController {
	readonly router: Router;
	private producer!: Producer;
	private consumer!: Consumer;
	private readonly map = new Map<string, (value: unknown) => void>();
	// TODO: ХАРДКОД УБРАТЬ
	private readonly kafkaService: KafkaService = rootContainer.get(
		COMMON_TYPES.services.kafka,
	);
	// СДЕЛАТЬ АЙДИ ТОПИКОВ И КОНСЮМЕРОВ КАК СИМВОЛЫ
	private topics!: Ids;

	constructor() {
		// private readonly kafkaService: KafkaService, // @inject(COMMON_TYPES.services.kafka)
		this.router = Router();
	}

	protected init = async (options: Ids) => {
		this.topics = options;
		await this.createProducer();
		await this.createConsumer();
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
			topic: this.topics.requestTopicId,
			messages: [{ value: JSON.stringify({ message: data, id }) }],
		});

		return await response;
	};

	protected sendAndForget = (data: unknown): void => {
		this.producer.send({
			topic: this.topics.requestTopicId,
			messages: [
				{ value: JSON.stringify({ message: data, id: 'TODO: REMOVE' }) },
			],
		});
	};

	private createProducer = async () => {
		this.producer = this.kafkaService.createProducer();

		await this.producer.connect();
	};

	private createConsumer = async () => {
		console.log('CREATE CONSUMER');
		this.consumer = this.kafkaService.createConsumer(this.topics.groupId);

		await this.consumer.connect();
		await this.consumer.subscribe({
			topic: this.topics.responseTopicId,
			fromBeginning: false,
		});
		this.consumer.run({
			eachMessage: async ({ topic, partition, message }) => {
				console.log('ЧЁ ПАРСИМ', message.value!.toString());
				const value = JSON.parse(message.value!.toString());
				console.log('Ответ получен:', value);
				const resolve = this.map.get(value.id);
				this.map.delete(value.id);
				resolve!(value.message);
			},
		});
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
