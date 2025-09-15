import { inject, injectable } from "inversify";
import { Repository } from "../repository/repository";
import { MODULE_TYPES } from "../../containers/TYPES.di";

@injectable()
export class Service {
	constructor(
		@inject(MODULE_TYPES.modules.)
		private readonly repository: Repository,
	) {}
}
