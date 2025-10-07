import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { ElasticSearchService } from '../../../../../common/services/elasticsearch/elasticsearch.service';
import { INDEXES } from '../../../../../common/services/elasticsearch/INDEXES';
import { ElasticSearchBase } from '../../../../config/elasticsearch/elasticsearch.types';

@injectable()
export class TracksElastic extends ElasticSearchBase {
	index = INDEXES.second_index;

	constructor(
		@inject(SERVICES_TYPES.elasticsearch)
		private readonly es: ElasticSearchService,
		@inject(SERVICES_TYPES.database)
		private readonly db: DatabaseService,
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
			.select(['id', 'name', 'name_en', 'about'])
			.execute();

		const body = tracks.flatMap(doc => [
			{ index: { _index: this.index, _id: doc.id } },
			{
				name: doc.name,
				name_en: doc.name_en,
				about: doc.about,
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
