import { Client } from '@elastic/elasticsearch';
import { INDEXES } from './INDEXES';
import { inject, injectable } from 'inversify';
import { ConfigService } from '../config/config.service';
import { SERVICES_TYPES } from '../../containers/SERVICES_TYPES.di';

@injectable()
export class ElasticSearchService {
	es: Client;

	constructor(
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
	) {
		this.es = new Client({ node: this.configService.getEnv('ELASTIC_URL') });
	}

	searchSuggest = async (index: keyof typeof INDEXES, query: string) => {
		return await this.es.search({
			index,
			query: {
				multi_match: {
					query,
					type: 'bool_prefix',
					fields: ['name', 'name._2gram', 'name._3gram'],
				},
			},
		});
	};

	search = async (index: keyof typeof INDEXES, query: string) => {
		return await this.es.search({
			index,
			query: {
				match: {
					name: {
						query,
						operator: 'and',
						fuzziness: 'auto',
						auto_generate_synonyms_phrase_query: true,
						zero_terms_query: 'none',
						fuzzy_transpositions: true,
						lenient: true,
					},
				},
			},
		});
	};
}
