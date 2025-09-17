import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { COMMON_TYPES } from '../../../containers/TYPES.di';
import { KafkaController } from '../../../config/kafka.controller';

// TODO: ДУБЛИРОВАНИЕ УБРАТЬ
interface Ids {
	requestTopicId: string;
	responseTopicId: string;
	groupId: string;
}

@injectable()
export class TracksController extends BaseController {
	kafkaController: KafkaController;
	constructor(
		@inject(COMMON_TYPES.factories.kafka)
		private readonly kafkaFactory: (options: Ids) => KafkaController,
	) {
		super();
		this.kafkaController = this.kafkaFactory({
			groupId: 'tracks-group',
			requestTopicId: 'request-topic',
			responseTopicId: 'response-topic',
		});

		this.bindRoutes([
			{
				handle: this.handle,
				method: 'get',
				path: serverPaths.tracks,
			},
		]);
	}

	handle = async (req: Request, res: Response) => {
		const response = await this.kafkaController.sendAndWait(
			'Hello from API-Gateway!',
		);

		console.log(response);
		res.json({ 'from reply': response });
	};
}

// TODO: Задачи на завтра
// Допилить контроллер и разбить на 2 класса
// Сделать базовый сервис для приёмников
// Сделать чтобы сервер не запускался пока не загрузится кафка
