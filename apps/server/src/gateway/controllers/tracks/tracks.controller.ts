import { Request, Response } from 'express';
import { injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';

@injectable()
export class TracksController extends BaseController {
	constructor() {
		super();
		this.init({ groupId: 'a', requestTopicId: 'b', responseTopicId: 'c' });
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
