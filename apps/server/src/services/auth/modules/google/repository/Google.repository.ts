import { inject, injectable } from 'inversify';
import { AUTH_TYPES } from '../../../containers/TYPES.di';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';

@injectable()
export class GoogleRepository {
	constructor(
		@inject(AUTH_TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}

	getUserId = async (providerId: string) => {
		const user = await this.databaseService.db
			.selectFrom('users')
			.select('id')
			.where('provider_id', '=', providerId)
			.executeTakeFirst();
		return user?.id;
	};
}
