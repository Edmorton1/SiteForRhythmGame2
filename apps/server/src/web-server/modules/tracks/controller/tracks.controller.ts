import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/controllers/base.controller';
import { serverPaths } from '../../../../../../../libs/common/PATHS';
import { TOPICS } from '../../../../common/topics/TOPICS';
// prettier-ignore
import { TRACKS_FUNCTIONS, TRACKS_KEYS } from '../../../../common/modules/tracks/tracks.functions';
import { zodValidateSchema } from '../../../common/pipes/zod.pipe';
import { zId } from '../../../../../../../libs/models/enums/zod';
import { TracksQueryParamsZodSchema } from '../../../../../../../libs/models/schemas/tracks';
import z from 'zod';
// prettier-ignore
import { KafkaSender, KafkaSenderReturn } from '../../../common/adapters/kafka.sender';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

@injectable()
export class TracksController extends BaseController {
	sender: KafkaSenderReturn<TRACKS_FUNCTIONS>;

	constructor(
		@inject(ADAPTERS.web.kafkaSender)
		private readonly kafkaSender: KafkaSender,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.getAllTracks,
				method: 'get',
				path: `${serverPaths.tracks}`,
			},
			{
				handle: this.searchTracks,
				method: 'get',
				path: `${serverPaths.tracksSearch}`,
			},
			{
				handle: this.searchTracksSuggest,
				method: 'get',
				path: `${serverPaths.tracksSearchSuggest}`,
			},
			{
				handle: this.getTrack,
				method: 'get',
				path: `${serverPaths.tracks}/:id`,
			},
		]);
		this.sender = this.kafkaSender.initSender<TRACKS_FUNCTIONS>();
	}

	private validateQuery = (val: unknown) => {
		return zodValidateSchema(z.string(), val);
	};

	searchTracksSuggest = async (req: Request, res: Response) => {
		const query = this.validateQuery(req.query['query']);

		const suggest = await this.sender.sendAndWait(
			{
				func: TRACKS_KEYS.getSearchSuggestTrack,
				message: query,
			},
			TOPICS.requests.tracks,
		);

		res.json(suggest);
	};

	searchTracks = async (req: Request, res: Response) => {
		console.log(req.query['query']);
		const query = this.validateQuery(req.query['query']);

		const tracks = await this.sender.sendAndWait(
			{
				func: TRACKS_KEYS.getSearchTrack,
				message: query,
			},
			TOPICS.requests.tracks,
		);

		res.json(tracks);
	};

	getAllTracks = async (req: Request, res: Response) => {
		console.log(req.query);
		const params = zodValidateSchema(
			TracksQueryParamsZodSchema.partial(),
			req.query,
		);

		console.log('OPTIONS', params);
		const tracks = await this.sender.sendAndWait(
			{
				func: TRACKS_KEYS.getAllTracks,
				message: params,
			},
			TOPICS.requests.tracks,
		);

		res.json(tracks);
	};

	getTrack = async (req: Request, res: Response) => {
		const id = zodValidateSchema(zId, req.params['id']);
		const track = await this.sender.sendAndWait(
			{
				func: TRACKS_KEYS.getTrack,
				message: id,
			},
			TOPICS.requests.tracks,
		);

		res.json(track);
	};
}

// По каким параметрам сортировать?
// plays_count
// downloads_count
// likes_count
// bpm
// difficulty
// По сложности будет смотреть самые популярные и сложные

// most popular (TODAY)
// most popular (WEEK)
// most popular (MONTH)
// most popular (YEAR)

// Дате выхода. Типа самые популярные за неделю, день, месяц, год

// Фильтры

// lang
// difficulty
// genres

// ПО СТРОКЕ

// author
// performer
// name

// Будет главный поиск. Он будет искать всё - треки, авторов, перформеров

// TODO: Фильтры потом сделать
