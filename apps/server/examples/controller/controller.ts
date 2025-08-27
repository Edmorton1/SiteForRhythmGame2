import { injectable } from "tsyringe";
import { BaseController } from "../../src/config/server/base.controller";
import { Request, Response } from "express";
import { serverPaths } from "../../../../libs/shared/PATHS";
import { Service } from "../service/service";

@injectable()
export class Controller extends BaseController {
	constructor(private readonly service: Service) {
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
