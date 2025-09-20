import { inject, injectable } from 'inversify';
import { TracksRepository } from '../repository/repository';
import { TRACKS_TYPES } from '../../containers/TYPES.di';

@injectable()
export class TracksService {
	constructor(
		@inject(TRACKS_TYPES.modules.tracks.repository)
		private readonly repository: TracksRepository,
	) {}
}
