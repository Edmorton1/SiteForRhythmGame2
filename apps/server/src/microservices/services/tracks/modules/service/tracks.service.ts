import { inject, injectable } from 'inversify';
import { TracksRepository } from '../repository/tracks.repository';
import { BaseService } from '../../../../config/base.service';
import { TRACKS_FUNCTIONS, TRACKS_MICRO_TYPES } from '../../container/TYPES.di';

@injectable()
export class TracksService extends BaseService {
	constructor(
		@inject(TRACKS_MICRO_TYPES.repositories.tracks)
		private readonly TracksRepository: TracksRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: TRACKS_FUNCTIONS.getAllTracks,
				func: this.getAllTracks,
			},
		]);
	}

	getAllTracks = async () => {
		const tracks = await this.TracksRepository.getAllTracks();
		return tracks;
	};
}
