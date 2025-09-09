import { Request, Response } from "express";
import { Service } from "../service/service";
import { inject, injectable } from "inversify";
import { BaseController } from "../../../config/server/base.controller";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { TYPES } from "../../../containers/TYPES";

@injectable()
export class Controller extends BaseController {
	constructor(
		@inject(TYPES.modules.)
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
