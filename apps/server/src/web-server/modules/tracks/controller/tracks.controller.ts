import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { KafkaWebServer } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TRACKS_FUNCTIONS } from '../../../../microservices/services/tracks/container/TYPES.di';

@injectable()
export class TracksController extends BaseController {
	constructor(
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.getAllTracks,
				method: 'get',
				path: serverPaths.tracks,
			},
		]);
	}

	getAllTracks = async (req: Request, res: Response) => {
		const tracks = await this.kafkaWebServer.sendAndWait({
			func: TRACKS_FUNCTIONS.getAllTracks,
			message: undefined,
			status: 'conform',
		});

		res.json(tracks);
	};
}
