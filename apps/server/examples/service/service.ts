import { injectable } from "tsyringe";
import { SQL } from "../sql/sql";

@injectable()
export class Service {
	constructor(private readonly SQL: SQL) {}
}
