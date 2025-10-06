import { Client } from '@elastic/elasticsearch';
import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../containers/SERVICES_TYPES.di';
import { DatabaseService } from '../postgres/database.service';

@injectable()
export class ElasticSearchService {
	es: Client;

	constructor(
		@inject(SERVICES_TYPES.database)
		private readonly db: DatabaseService,
	) {
		const es = new Client({ node: 'http://localhost:9200' });
		// Реиндексация
		(async () => {
			const tracks = await this.db.db
				.selectFrom('tracks')
				.select(['id', 'name', 'name_en', 'about'])
				.execute();

			console.log(tracks);
			const body = tracks.flatMap(doc => [
				{ index: { _index: 'second_index', _id: doc.id } },
				{
					name: doc.name,
					name_en: doc.name_en,
					about: doc.about,
				},
			]);

			console.log(body);

			const exists = await es.indices.exists({ index: 'second_index' });

			if (exists) {
				await es.indices.delete({ index: 'second_index' });
			}

			await es.indices.create({ index: 'second_index' });

			await es.indices.putMapping({
				index: 'second_index',
				properties: {
					name: {
						type: 'search_as_you_type',
						analyzer: 'russian',
						fields: {
							keyword: {
								type: 'keyword',
							},
						},
					},
					name_en: {
						type: 'search_as_you_type',
						analyzer: 'english',
						fields: {
							keyword: {
								type: 'keyword',
							},
						},
					},
					about: {
						type: 'text',
						analyzer: 'russian',
						fields: {
							keyword: {
								type: 'keyword',
								ignore_above: 256,
							},
						},
					},
				},
			});

			await es.bulk({ refresh: true, body });
		})();

		this.es = es;
	}
}
