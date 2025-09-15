import { Request, Response } from "express";
import { Service } from "../service/service";
import { inject, injectable } from "inversify";
import { BaseController } from "../../../../config/base.controller";
import { MODULE_TYPES } from "../../containers/TYPES.di";
import { serverPaths } from "../../../../../../../libs/shared/PATHS";


@injectable()
export class Controller extends BaseController {
	constructor(
		@inject(MODULE_TYPES.modules.)
		private readonly service: Service,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.handle,
				method: "get",
				path: serverPaths.,
			},
		]);
	}

	handle = async (req: Request, res: Response) => {};
}
