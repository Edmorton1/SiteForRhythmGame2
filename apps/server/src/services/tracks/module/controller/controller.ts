import { Request, Response } from 'express';
import { TracksService } from '../service/service';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../../config/base.controller';
import { TRACKS_TYPES } from '../../containers/TYPES.di';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';

@injectable()
export class TracksController extends BaseController {
	constructor(
		@inject(TRACKS_TYPES.modules.tracks.service)
		private readonly service: TracksService,
	) {
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
		res.json({
			any: '123',
		});
	};
}
