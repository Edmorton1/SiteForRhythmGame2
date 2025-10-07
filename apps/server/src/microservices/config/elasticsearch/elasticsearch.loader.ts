import { multiInject } from 'inversify';
import { MICRO_TYPES } from '../containers/TYPES.di';
import { ElasticSearchBase } from './elasticsearch.types';

export class ElasticSearchLoader {
	constructor(
		@multiInject(MICRO_TYPES.elastics)
		private readonly elastics: ElasticSearchBase[],
	) {}

	loadElastics = async () => {
		for (const elastic of this.elastics) {
			await elastic.collect();
		}
	};
}
