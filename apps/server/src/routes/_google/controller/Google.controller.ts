import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { TYPES } from "../../../containers/TYPES";
import { BaseController } from "../../../config/base.controller";
import passport from "passport";

@injectable()
export class Controller extends BaseController {
	constructor() {
		super();
		this.bindRoutes([
			{
				handle: this.getLink,
				method: "get",
				path: serverPaths.authGoogle,
			},
		]);
	}

	getLink = async (req: Request, res: Response) => {
		passport;
	};
}
