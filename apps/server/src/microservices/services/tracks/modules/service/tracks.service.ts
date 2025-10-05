import { inject, injectable } from 'inversify';
import { TracksRepository } from '../repository/tracks.repository';
import { BaseService } from '../../../../config/base.service';
import { TRACKS_MICRO_TYPES } from '../../container/TYPES.di';
// prettier-ignore
import { TRACKS_FUNCTIONS, TRACKS_KEYS } from '../../../../../common/modules/tracks/tracks.functions';
import { HttpError } from '../../../../../common/http/http.error';

@injectable()
export class TracksService extends BaseService {
	constructor(
		@inject(TRACKS_MICRO_TYPES.repositories.tracks)
		private readonly TracksRepository: TracksRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: TRACKS_KEYS.getAllTracks,
				func: this.getAllTracks,
			},
			{
				name: TRACKS_KEYS.getTrack,
				func: this.getTrack,
			},
			{
				name: TRACKS_KEYS.getSearchTrack,
				func: this.getSearchTrack,
			},
		]);
	}

	getAllTracks = async (
		options: TRACKS_FUNCTIONS['getAllTracks']['input'],
	): Promise<TRACKS_FUNCTIONS['getAllTracks']['output']> => {
		console.log('CURSOR', options);
		return await this.TracksRepository.getAllTracks(options);
	};

	getSearchTrack = async (
		query: TRACKS_FUNCTIONS['getSearchTrack']['input'],
	): Promise<TRACKS_FUNCTIONS['getSearchTrack']['output']> => {
		const tracks = await this.TracksRepository.getSearchTrack(query);

		return tracks;
	};

	getTrack = async (
		id: TRACKS_FUNCTIONS['getTrack']['input'],
	): Promise<TRACKS_FUNCTIONS['getTrack']['output']> => {
		const track = await this.TracksRepository.getTrack(id);
		if (!track) {
			throw new HttpError(404);
		}
		return track;
	};
}
