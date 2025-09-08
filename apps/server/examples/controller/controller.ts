import { BaseController } from "../../src/config/server/base.controller";
import { Request, Response } from "express";
import { serverPaths } from "../../../../libs/shared/PATHS";
import { Service } from "../service/service";
import { inject, injectable } from "inversify";

@injectable()
export class Controller extends BaseController {
	constructor(
		@inject()
		private readonly service: Service,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.handle,
				method: "get",
				path: serverPaths.path,
			},
		]);
	}

	handle = async (req: Request, res: Response) => {};
}
