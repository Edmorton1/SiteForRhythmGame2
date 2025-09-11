import { inject, injectable } from 'inversify';
import { TYPES } from '../../../containers/TYPES';
import { DatabaseService } from '../postgres/database.service';

@injectable()
export class DbQueriesService {
	constructor(
		@inject(TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}
}
