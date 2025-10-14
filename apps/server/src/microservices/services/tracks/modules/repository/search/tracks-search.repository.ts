import { inject, injectable } from 'inversify';
import { ElasticSearchAdapter } from '../../../../../common/adapters/elasticsearch/elasticsearch.adapter';
import { INDEXES } from '../../../../../common/adapters/elasticsearch/INDEXES';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { TRACKS_SELECT } from '../allTracks/tracks.repository';
import { ADAPTERS } from '../../../../../../common/adapters/container/adapters.types';

@injectable()
export class TracksSearchRepository {
	constructor(
		@inject(ADAPTERS.micro.elasticsearch)
		private readonly es: ElasticSearchAdapter,
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
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

		const tracks = await this.db.db
			.selectFrom('tracks')
			.select(TRACKS_SELECT)
			.where('id', 'in', tracks_ids)
			.execute();

		return tracks;
	};
}
