import { Container } from 'inversify';
import { rootMicroContainer } from '../../../service-config/containers/container.di';
import { TRACKS_MICRO_TYPES } from './TYPES.di';
import { TrackController } from '../modules/tracks/controllers/track.controller';

export const trackMicroContainer = new Container({
	parent: rootMicroContainer,
});

trackMicroContainer
	.bind<TrackController>(TRACKS_MICRO_TYPES.controllers)
	.to(TrackController)
	.inSingletonScope();
