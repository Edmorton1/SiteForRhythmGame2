import { Client } from '@elastic/elasticsearch';
import { INDEXES } from './INDEXES';
import { inject, injectable } from 'inversify';
import { ConfigAdapter } from '../../../../common/adapters/config/config.adapter';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

@injectable()
export class ElasticSearchAdapter {
	es: Client;

	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
	) {
		this.es = new Client({ node: this.config.getEnv('ELASTIC_URL') });
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
