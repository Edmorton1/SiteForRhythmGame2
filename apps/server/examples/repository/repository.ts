import { inject, injectable } from "inversify";
import { TYPES } from "../../../containers/TYPES";
import { DatabaseService } from "../../../common/services/postgres/database.service";

@injectable()
export class Repository {
	constructor(
		@inject(TYPES.services.database)
		private readonly db: DatabaseService,
	) {}
}
