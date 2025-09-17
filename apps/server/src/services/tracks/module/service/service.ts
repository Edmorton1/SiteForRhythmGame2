import { inject, injectable } from 'inversify';
import { TracksRepository } from '../repository/repository';
import { TRACKS_TYPES } from '../../containers/TYPES.di';
// надо чтобы был свой сервер у микросервисов, который регал бы соединения

@injectable()
export class TracksService extends Base {
	constructor(
		@inject(TRACKS_TYPES.modules.tracks.repository)
		private readonly repository: TracksRepository,
	) {}
}
