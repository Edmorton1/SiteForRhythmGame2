import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { KafkaWebServer } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
import { TRACKS_FUNCTIONS } from '../../../../common/modules/tracks/tracks.functions';

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
		const tracks = await this.kafkaWebServer.sendAndWait(
			{
				func: TRACKS_FUNCTIONS.getAllTracks,
				message: undefined,
				status: 'conform',
			},
			TOPICS.requests.tracks,
		);

		res.json(tracks);
	};
}
