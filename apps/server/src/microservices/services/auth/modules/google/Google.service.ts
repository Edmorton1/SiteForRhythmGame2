import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { BaseService } from '../../../../config/base.service';
import { AUTH_FUNCTIONS } from '../../container/TYPES.di';
import { MICRO_TYPES } from '../../../../config/containers/TYPES.di';

@injectable()
export class GoogleService extends BaseService {
	constructor(
		@inject(MICRO_TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {
		super();
		this.bindFunctions([
			{
				name: AUTH_FUNCTIONS.getUserId,
				func: this.getUserId,
			},
		]);
	}

	getUserId = async (providerId: string) => {
		const user = await this.databaseService.db
			.selectFrom('users')
			.select('id')
			.where('provider_id', '=', providerId)
			.executeTakeFirst();
		return user?.id;
	};
}
