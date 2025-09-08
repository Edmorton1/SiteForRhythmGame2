import { inject, injectable } from "inversify";
import { DatabaseService } from "../../src/common/services/postgres/database.service";
import { TYPES } from "../../src/containers/TYPES";

@injectable()
export class Repository {
	constructor(
		@inject(TYPES.services.database)
		private readonly db: DatabaseService,
	) {}
}
