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
		console.log("[REQUEST]: LOGIN");
		const userDTO = ZodValidateSchema(LoginDTOZodSchema, req.body);
		const { payload, profile } = await this.authService.login(userDTO);

		// TODO: СДЕЛАТЬ УДАЛЕНИЕ СТАРОЙ СЕССИИ ПРИ ЛОГИНЕ И РЕГИСТРАЦИИ
		// req.session.destroy(err => console.error(err));

		req.session.payload = payload;

		res.json(profile);
	};

	logout = (req: Request, res: Response) => {
		console.log("[REQUEST]: LOGOUT");
		req.session.destroy(err => {
			if (err) console.error("ERROR COOKIE DON'T WORK!!!", err);
			res.clearCookie(this.configService.getEnv("COOKIE_NAME")).sendStatus(204);
		});
	};

	init = async (req: Request, res: Response<UserProfile>) => {
		console.log("[REQUEST]: INIT");
		if (!req.session.payload) {
			// res.sendStatus(200);
			res.json({ avatar: null, country_code: "BE", id: 1, name: "amon" });
			return;
		}
		const id = req.session.payload.id;
		const profile = await this.authService.getProfileById(id);
		res.json(profile);
	};
}
