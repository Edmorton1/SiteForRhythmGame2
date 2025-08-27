import { injectable } from "tsyringe";
import { DatabaseService } from "../../src/common/services/postgres/database.service";

@injectable()
export class SQL {
	constructor(private readonly db: DatabaseService) {}
}
