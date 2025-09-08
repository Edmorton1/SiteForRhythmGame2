import { inject, injectable } from "inversify";
import { Repository } from "../sql/repository";

@injectable()
export class Service {
	constructor(
		@inject()
		private readonly repository: Repository,
	) {}
}
