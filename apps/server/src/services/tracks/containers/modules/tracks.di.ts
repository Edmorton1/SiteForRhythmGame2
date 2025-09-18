import { ContainerModule } from 'inversify';
import { TRACKS_TYPES } from '../TYPES.di';
import { TracksService } from '../../module/service/service';
import { TracksRepository } from '../../module/repository/repository';

export const tracksBindings = new ContainerModule(({ bind }) => {
	bind<TracksService>(TRACKS_TYPES.modules.tracks.service).to(TracksService);
	bind<TracksRepository>(TRACKS_TYPES.modules.tracks.repository).to(
		TracksRepository,
	);
});
