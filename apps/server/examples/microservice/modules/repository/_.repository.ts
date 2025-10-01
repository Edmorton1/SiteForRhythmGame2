import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../../../../common/containers/SERVICES_TYPES.di';
import { DatabaseService } from '../../../../../common/services/postgres/database.service';

@injectable()
export class _Repository {
	constructor(
		@inject(SERVICES_TYPES.database)
		private readonly databaseService: DatabaseService,
	) {}
}
