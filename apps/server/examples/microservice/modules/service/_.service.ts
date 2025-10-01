import { inject, injectable } from 'inversify';
import { _Repository } from '../repository/_.repository';
import { BaseService } from '../../../../config/base.service';
import { __FUNCTIONS, __MICRO_TYPES } from '../../container/TYPES.di';

@injectable()
export class _Service extends BaseService {
	constructor(
		@inject(__MICRO_TYPES.repositories._)
		private readonly _Repository: _Repository,
	) {
		super();
		this.bindFunctions([
			{
				name: __FUNCTIONS._,
				func: this.,
			},
		]);
	}
}
