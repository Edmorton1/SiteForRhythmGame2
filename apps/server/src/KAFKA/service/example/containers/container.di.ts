import { Container } from 'inversify';
import { rootMicroContainer } from '../../service-config/containers/container.di';
import { TRACKS_MICRO_TYPES } from './TYPES.di';
import { TrackController } from '../modules/tracks/controllers/track.controller';
import { TrackRepository } from '../modules/tracks/repository/tracks.repository';

export const trackMicroContainer = new Container({
	parent: rootMicroContainer,
});

trackMicroContainer
	.bind<TrackController>(TRACKS_MICRO_TYPES.controllers)
	.to(TrackController)
	.inSingletonScope();

trackMicroContainer
	.bind<TrackRepository>(TRACKS_MICRO_TYPES.repository.track)
	.to(TrackRepository)
	.inSingletonScope();
