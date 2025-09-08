import { inject, injectable } from "inversify";
import { DatabaseService } from "../../common/services/postgres/database.service";
import { TYPES } from "../../containers/TYPES";

@injectable()
export class AuthRepository {
	constructor(
		@inject(TYPES.services.database)
		private readonly db: DatabaseService,
	) {}
}
