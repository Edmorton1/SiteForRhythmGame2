import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { ElasticSearchAdapter } from '../../../../common/adapters/elasticsearch/elasticsearch.adapter';
import { INDEXES } from '../../../../common/adapters/elasticsearch/INDEXES';
import { ElasticSearchBase } from '../../../../config/elasticsearch/elasticsearch.types';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';

@injectable()
export class TracksElasticSearch extends ElasticSearchBase {
	index = INDEXES.second_index;

	constructor(
		@inject(ADAPTERS.micro.elasticsearch)
		private readonly es: ElasticSearchAdapter,
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
	) {
		super();
	}

	collect = async () => {
		await this.createIndex();
		await this.putMappings();
		await this.fillIndex();
	};

	private fillIndex = async () => {
		const tracks = await this.db.db
			.selectFrom('tracks')
			.select(['id', 'name', 'name_en'])
			.execute();

		const body = tracks.flatMap(doc => [
			{ index: { _index: this.index, _id: doc.id } },
			{
				name: doc.name,
				name_en: doc.name_en,
			},
		]);

		await this.es.es.bulk({ refresh: true, body });
	};

	private createIndex = async () => {
		const exists = await this.es.es.indices.exists({ index: this.index });

		if (exists) {
			await this.es.es.indices.delete({ index: this.index });
		}

		await this.es.es.indices.create({ index: this.index });
	};

	private putMappings = async () => {
		await this.es.es.indices.putMapping({
			index: this.index,
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
	};
}
