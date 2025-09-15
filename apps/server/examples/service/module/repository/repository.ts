import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../common/services/postgres/database.service';
import { MODULE_TYPES } from '../../containers/TYPES.di';

@injectable()
export class Repository {
	constructor(
		@inject(MODULE_TYPES.services.database)
		private readonly database: DatabaseService,
	) {}
}
