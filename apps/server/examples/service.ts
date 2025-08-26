import { injectable } from "tsyringe";
import { SQL } from "./sql";

@injectable()
export class Service {
	constructor(private readonly SQL: SQL) {}
}
