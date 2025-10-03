import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { KafkaWebServer } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
// prettier-ignore
import { TRACKS_FUNCTIONS, TRACKS_KEYS } from '../../../../common/modules/tracks/tracks.functions';
import { ZodValidateSchema } from '../../../common/pipes/zod.pipe';
import { zid } from '../../../../../../../libs/models/enums/zod';

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
		const tracks = await this.kafkaWebServer.sendAndWait<
			TRACKS_FUNCTIONS,
			'getAllTracks'
		>(
			{
				func: TRACKS_KEYS.getAllTracks,
				message: undefined,
			},
			TOPICS.requests.tracks,
		);

		res.json(tracks);
	};

	getTrack = async (req: Request, res: Response) => {
		const id = ZodValidateSchema(zid, req.params['id']);
		const track = await this.kafkaWebServer.sendAndWait<TRACKS_FUNCTIONS>(
			{
				func: TRACKS_KEYS.getAllTracks,
				message: id,
			},
			TOPICS.requests.tracks,
		);

		res.json(track);
	};
}
