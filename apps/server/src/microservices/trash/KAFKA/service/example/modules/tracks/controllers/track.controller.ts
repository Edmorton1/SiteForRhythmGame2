import { inject } from 'inversify';
import { TrackRepository } from '../repository/tracks.repository';
// prettier-ignore
import { TRACKS_FUNCTIONS, TRACKS_MICRO_TYPES } from '../../../containers/TYPES.di';
import { BaseController } from '../../../../../../../config/base.controller';

export class TrackController extends BaseController {
	constructor(
		@inject(TRACKS_MICRO_TYPES.repository.track)
		private readonly trackRepository: TrackRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: TRACKS_FUNCTIONS.tracks,
				func: this.handle,
			},
		]);
	}

	handle = (data: any) => {
		console.log('TRACKS SERVICE СРАБОТАЛА ФУНКЦИЯ', data);
		this.trackRepository.log();
		return data;
	};
}
