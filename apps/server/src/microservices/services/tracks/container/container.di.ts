import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';
import { TRACKS_MICRO_TYPES } from './TYPES.di';
import { MICRO_TYPES } from '../../../config/containers/TYPES.di';
import { TracksService } from '../modules/service/tracks.service';
import { TracksRepository } from '../modules/repository/tracks.repository';
import { TracksElastic } from '../modules/elastic/tracks.elastic';
import { TracksSearchRepository } from '../modules/repository/tracks-search.repository';

export const TracksMicroContainer = new Container({
	parent: rootMicroContainer,
});

TracksMicroContainer.bind<TracksService>(MICRO_TYPES.controllers)
	.to(TracksService)
	.inSingletonScope();

TracksMicroContainer.bind<TracksRepository>(
	TRACKS_MICRO_TYPES.repositories.tracks,
)
	.to(TracksRepository)
	.inSingletonScope();

TracksMicroContainer.bind<TracksSearchRepository>(
	TRACKS_MICRO_TYPES.repositories.tracksSearch,
)
	.to(TracksSearchRepository)
	.inSingletonScope();

TracksMicroContainer.bind<TracksElastic>(MICRO_TYPES.elastics)
	.to(TracksElastic)
	.inSingletonScope();
