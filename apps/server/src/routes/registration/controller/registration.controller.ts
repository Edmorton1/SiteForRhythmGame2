import { AuthDTOZodSchema } from "../../../common/models/schemas/auth.dto";
import { RegistrationService } from "../service/registration.service";
import { zodValidateFormData } from "../../../common/pipes/zod.formdata.pipe";
import { injectable } from "tsyringe";
import { CookieOptions, Request, Response } from "express";
import { BaseController } from "../../../config/server/base.controller";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { ConfigService } from "../../../common/services/config/config.service";
import multer from "multer";

const cookieName = "token";
const cookieOauth = "redirect";
// TODO: Make normal age
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	maxAge: 1000 * 60 * 60 * 24,
};

@injectable()
export class RegistrationController extends BaseController {
	constructor(
		private readonly registrationService: RegistrationService,
		private readonly configService: ConfigService,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.registration,
				method: "post",
				path: serverPaths.registration,
				middlewares: [multer({}).single("avatar")],
			},
			{
				handle: this.redirect,
				// TODO: Change on POST
				method: "get",
				path: serverPaths.redirect,
			},
		]);
	}

	registration = async (req: Request, res: Response) => {
		const authDTO = zodValidateFormData({
			data: req.body,
			name: "data",
			schema: AuthDTOZodSchema,
			files: { avatar: req.file },
		});

		const token: string | undefined = req.cookies[cookieOauth];
		res.clearCookie(cookieOauth);

		const response = await this.registrationService.registration(
			authDTO,
			token,
		);

		res
			.cookie(cookieName, response.token, cookieOptions)
			.status(201)
			.json(response.profile);
	};

	redirect = (req: Request, res: Response) => {
		// МОК ТИПА ПРОВАЙДЕР ПЕРЕДАЛ РЕАЛЬНЫЙ OPEN_ID
		const token = this.registrationService.redirect();
		res.cookie(cookieOauth, token, cookieOptions);
		res
			.status(300)
			.redirect(this.configService.getEnv("REDIRECT_URL") + "?oauth=true");
	};
}
