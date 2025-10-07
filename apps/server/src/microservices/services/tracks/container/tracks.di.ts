import { ContainerModule } from 'inversify';
import { TRACKS } from './tracks.types';
import { MICRO } from '../../../config/containers/micro.types';
import { TracksService } from '../modules/service/tracks.service';
import { TracksRepository } from '../modules/repository/tracks.repository';
import { TracksElasticSearch } from '../modules/elasticsearch/tracks.elasticsearch';
import { TracksSearchRepository } from '../modules/repository/tracks-search.repository';

export const tracksBindings = new ContainerModule(({ bind }) => {
	bind<TracksService>(MICRO.controllers).to(TracksService).inSingletonScope();

	bind<TracksRepository>(TRACKS.repositories.tracks)
		.to(TracksRepository)
		.inSingletonScope();

	bind<TracksSearchRepository>(TRACKS.repositories.tracksSearch)
		.to(TracksSearchRepository)
		.inSingletonScope();

	bind<TracksElasticSearch>(MICRO.elastics)
		.to(TracksElasticSearch)
		.inSingletonScope();
});
