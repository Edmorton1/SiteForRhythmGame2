import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { KafkaWebServer, KafkaSender } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
// prettier-ignore
import { TRACKS_FUNCTIONS, TRACKS_KEYS } from '../../../../common/modules/tracks/tracks.functions';
import { ZodValidateSchema } from '../../../common/pipes/zod.pipe';
import { zId } from '../../../../../../../libs/models/enums/zod';
// prettier-ignore
import { difficultiesZodSchema, TracksSort } from '../../../../../../../libs/models/schemas/tracks';
import z from 'zod';
import { zCountryCodes } from '../../../../../../../libs/models/enums/countries';

@injectable()
export class TracksController extends BaseController {
	sender: KafkaSender<TRACKS_FUNCTIONS>;

	constructor(
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
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
		this.sender = this.kafkaWebServer.initSender<TRACKS_FUNCTIONS>();
	}

	private validateQuery = (val: unknown) => {
		return ZodValidateSchema(z.string(), val);
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
		const cursor = ZodValidateSchema(zId.optional(), req.query['cursor']);
		const sort = ZodValidateSchema(TracksSort.optional(), req.query['sort']);
		const difficulty = ZodValidateSchema(
			z.union([
				difficultiesZodSchema.transform(lang => [lang]),
				z.array(difficultiesZodSchema),
				z.undefined(),
			]),
			req.query['difficulty'],
		);
		const lang = ZodValidateSchema(
			z.union([
				zCountryCodes.transform(lang => [lang]),
				z.array(zCountryCodes),
				z.undefined(),
			]),
			req.query['lang'],
		);

		console.log('OPTIONS', sort, cursor, lang, difficulty);
		const tracks = await this.sender.sendAndWait(
			{
				func: TRACKS_KEYS.getAllTracks,
				message: { cursor, sort, lang, difficulty },
			},
			TOPICS.requests.tracks,
		);

		res.json(tracks);
	};

	getTrack = async (req: Request, res: Response) => {
		const id = ZodValidateSchema(zId, req.params['id']);
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
