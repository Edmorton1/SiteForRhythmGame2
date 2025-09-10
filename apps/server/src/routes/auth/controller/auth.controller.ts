import { Request, Response } from "express";
import { AuthService } from "../service/auth.service";
import { inject, injectable } from "inversify";
import { BaseController } from "../../../config/base.controller";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { TYPES } from "../../../containers/TYPES";
import { ZodValidateSchema } from "../../../common/pipes/zod.pipe";
import { LoginDTOZodSchema } from "../_schemas/auth.schemas";
import { UserProfile } from "../../../../../../libs/models/schemas/profile";
import { userGuard } from "../../../common/guards/user.guard";
import { ConfigService } from "../../../common/services/config/config.service";

@injectable()
export class AuthController extends BaseController {
	constructor(
		@inject(TYPES.modules.auth.service)
		private readonly authService: AuthService,
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.login,
				method: "post",
				path: serverPaths.login,
			},
			{
				handle: this.logout,
				method: "delete",
				path: serverPaths.logout,
				middlewares: [userGuard],
			},
			{
				handle: this.init,
				method: "get",
				path: serverPaths.init,
			},
		]);
	}

	login = async (req: Request, res: Response<UserProfile>) => {
		const userDTO = ZodValidateSchema(LoginDTOZodSchema, req.body);
		const { payload, profile } = await this.authService.login(userDTO);
		req.session.payload = payload;

		res.json(profile);
	};

	logout = (req: Request, res: Response) => {
		req.session.destroy(err => {
			if (err) console.error("ERROR COOKIE DON'T WORK!!!", err);
			res.clearCookie(this.configService.getEnv("COOKIE_NAME")).sendStatus(204);
		});
	};

	init = async (req: Request, res: Response<UserProfile>) => {
		if (!req.session.payload) {
			res.sendStatus(200);
			return;
		}
		const id = req.session.payload.id;
		const profile = await this.authService.getProfileById(id);
		res.json(profile);
	};
}
