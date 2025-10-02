import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { BaseService } from '../../../../config/base.service';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { AUTH_FUNCTIONS } from '../../../../../common/modules/auth/auth.functions';

@injectable()
export class GoogleService extends BaseService {
	constructor(
		@inject(SERVICES_TYPES.database)
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
