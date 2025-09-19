import { Request, Response } from 'express';
import { BaseController } from '../config/base.controller';
import { inject } from 'inversify';
import { WEB_TYPES } from '../container/TYPES.di';
import { KafkaController } from '../../common/services/kafka/kafka.controller';
import { TRACKS_FUNCTIONS } from '../../microservices/trash/KAFKA/service/example/containers/TYPES.di';
import { randomUUID } from 'crypto';

export class TestController extends BaseController {
	constructor(
		@inject(WEB_TYPES.services.kafkaController)
		private readonly kafkaController: KafkaController,
	) {
		super();
		this.bindRoutes([
			{
				path: '/test',
				handle: this.getAny,
				method: 'get',
			},
		]);
	}

	getAny = async (req: Request, res: Response) => {
		console.log('ЗАПРОС ПРОИЗОШЁЛ');
		const id = randomUUID();
		const response = await this.kafkaController.sendAndWait({
			func: TRACKS_FUNCTIONS.tracks,
			id,
			message: 'Test message',
		});
		console.log(response);
		res.json(response);
	};
}
