import { inject, injectable } from 'inversify';
import { COMMON_TYPES } from '../../../web-server/container/TYPES.di';
import { DatabaseService } from '../postgres/database.service';

@injectable()
export class DbQueriesService {
	constructor(
		@inject(COMMON_TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}
}
