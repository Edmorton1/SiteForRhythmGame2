import { multiInject } from 'inversify';
import { MICRO } from '../containers/micro.types';
import { ElasticSearchBase } from './elasticsearch.types';

export class ElasticSearchLoader {
	constructor(
		@multiInject(MICRO.elastics)
		private readonly elasticSearchIndexes: ElasticSearchBase[],
	) {}

	loadElastics = async () => {
		for (const elastic of this.elasticSearchIndexes) {
			await elastic.collect();
		}
	};
}
