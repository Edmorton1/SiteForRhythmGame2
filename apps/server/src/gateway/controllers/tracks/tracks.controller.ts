import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';

@injectable()
export class TracksController extends BaseController {
	// TODO: Временное решение, потом убрать
	constructor() {
		super();
		this.init({
			// ДОЛЖЕН БЫТЬ У ВСЕХ РАЗНЫЙ
			groupId: 'test-group-12313221',
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
		const response = await this.sendAndWait('Hello from API-Gateway!');

		console.log(response);
		res.json({ 'from reply': response });
	};
}

// TODO: Задачи на завтра
// Допилить контроллер и разбить на 2 класса
// Сделать базовый сервис для приёмников
// Сделать чтобы сервер не запускался пока не загрузится кафка
