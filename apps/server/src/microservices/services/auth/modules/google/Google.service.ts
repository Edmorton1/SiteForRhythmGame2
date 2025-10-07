import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../common/adapters/postgres/database.adapters';
import { BaseService } from '../../../../config/service/base.service';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../../common/modules/auth/auth.functions';
import { ADAPTERS } from '../../../../../common/adapters/container/adapters.types';

@injectable()
export class GoogleService extends BaseService {
	constructor(
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
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
		const user = await this.db.db
			.selectFrom('users')
			.select('id')
			.where('provider_id', '=', providerId)
			.executeTakeFirst();
		return user?.id;
	};
}
