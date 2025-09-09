import { inject, injectable } from "inversify";
import { Repository } from "../sql/repository";
import { TYPES } from "../../../containers/TYPES";

@injectable()
export class Service {
	constructor(
		@inject(TYPES.modules.)
		private readonly repository: Repository,
	) {}
}
