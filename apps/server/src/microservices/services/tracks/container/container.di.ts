import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';
import { TRACKS_MICRO_TYPES } from './TYPES.di';
import { MICRO_TYPES } from '../../../config/containers/TYPES.di';
import { TracksService } from '../modules/service/tracks.service';
import { TracksRepository } from '../modules/repository/tracks.repository';

export const TracksMicroContainer = new Container({
	parent: rootMicroContainer,
});

TracksMicroContainer.bind(MICRO_TYPES.controllers)
	.to(TracksService)
	.inSingletonScope();

TracksMicroContainer.bind(TRACKS_MICRO_TYPES.repositories.tracks)
	.to(TracksRepository)
	.inSingletonScope();
