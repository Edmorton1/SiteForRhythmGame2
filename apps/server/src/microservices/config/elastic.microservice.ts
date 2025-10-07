import { multiInject } from 'inversify';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ElasticBase } from './elastic.types';

export class ElasticMicroservice {
	constructor(
		@multiInject(MICRO_TYPES.elastics)
		private readonly elastics: ElasticBase[],
	) {}

	loadElastics = async () => {
		for (const elastic of this.elastics) {
			await elastic.collect();
		}
	};
}
