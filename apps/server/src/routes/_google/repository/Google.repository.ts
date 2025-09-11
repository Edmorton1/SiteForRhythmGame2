import { inject, injectable } from 'inversify';
import { TYPES } from '../../../containers/TYPES';
import { DatabaseService } from '../../../common/services/postgres/database.service';

@injectable()
export class GoogleRepository {
	constructor(
		@inject(TYPES.services.database)
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
