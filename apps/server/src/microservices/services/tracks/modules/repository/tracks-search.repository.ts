import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { ElasticSearchService } from '../../../../../common/services/elasticsearch/elasticsearch.service';
import { INDEXES } from '../../../../../common/services/elasticsearch/INDEXES';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { TRACKS_SELECT } from './tracks.repository';

@injectable()
export class TracksSearchRepository {
	constructor(
		@inject(SERVICES_TYPES.elasticsearch)
		private readonly es: ElasticSearchService,
		@inject(SERVICES_TYPES.database)
		private readonly databaseService: DatabaseService,
	) {}

	getSearchSuggestTrack = async (query: string) => {
		const esSearchResult = await this.es.searchSuggest(
			INDEXES.second_index,
			query,
		);

		const suggests = esSearchResult.hits.hits.flatMap(
			e => (e._source as { name: string })['name'],
		);

		return suggests;
	};

	getSearchTrack = async (query: string) => {
		// TODO: Сделать чтобы он возвращал только нужные поля
		const esSearchResult = await this.es.search(INDEXES.second_index, query);

		const tracks_ids = esSearchResult.hits.hits
			.map(e => Number(e._id))
			.filter(e => typeof e === 'number');

		if (tracks_ids.length < 1) {
			return [];
		}

		const tracks = await this.databaseService.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', 'in', tracks_ids)
			.execute();

		return tracks;
	};
}
