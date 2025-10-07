import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';
import { BaseService } from '../../../../config/service/base.service';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../../common/modules/auth/auth.functions';

@injectable()
export class GoogleService extends BaseService {
	constructor(
		@inject(SERVICES_TYPES.database)
		private readonly databaseService: DatabaseService,
	) {
		super();
		this.bindFunctions([
			{
				name: AUTH_KEYS.getUserId,
				func: this.getUserId,
			},
		]);
	}

	getUserId = async (
		providerId: AUTH_FUNCTIONS['getUserId']['input'],
	): Promise<AUTH_FUNCTIONS['getUserId']['output']> => {
		const user = await this.databaseService.db
			.selectFrom('users')
			.select('id')
			.where('provider_id', '=', providerId)
			.executeTakeFirst();
		return user?.id;
	};
}
