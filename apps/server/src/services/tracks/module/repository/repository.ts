import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../common/services/postgres/database.service';
import { TRACKS_TYPES } from '../../containers/TYPES.di';

@injectable()
export class TracksRepository {
	constructor(
		@inject(TRACKS_TYPES.services.database)
		private readonly database: DatabaseService,
	) {}
}
