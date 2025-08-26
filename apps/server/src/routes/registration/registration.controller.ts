//prettier-ignore
import { AuthDTOZodSchema, LoginResponse, ProviderJWTPayload } from "../../common/models/schemas/auth.dto";
import { RegistrationService } from "./registration.service";
import { zodValidateFormData } from "../../common/pipes/zod.formdata.pipe";
import { injectable } from "tsyringe";
import { CookieOptions, Request, Response } from "express";
import { BaseController } from "../../config/server/base.controller";
import { CryptoService } from "../../common/services/crypto/crypto.service";
import { serverPaths } from "../../../../../libs/shared/PATHS";
import { ConfigService } from "../../common/services/config/config.service";
import { TokenService } from "./token.service";
import { HttpError } from "../../common/http/http.error";
import { UserDTO } from "../../../../../libs/models/schemas/user";
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
		private readonly authService: RegistrationService,
		private readonly cryptoService: CryptoService,
		private readonly configService: ConfigService,
		private readonly tokenService: TokenService,
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

		const { user, ...profileDTO } = authDTO;
		const token: string | undefined = req.cookies[cookieOauth];

		const authType = this.getAuthType(token, user);
		res.clearCookie(cookieOauth);

		let response: LoginResponse;
		if (authType === "email") {
			response = await this.authService.registrationWithEmail(authDTO);
		} else if (authType === "provider") {
			// TODO: REMOVE !
			const providerId = await this.validateProviderJWT(token!);
			response = await this.authService.registrationWithProvider(
				profileDTO,
				providerId,
			);
		} else {
			throw new HttpError(
				400,
				"There can't be a token, email and password at the same time, choose one authorization method",
			);
		}

		res
			.cookie(cookieName, response.token, cookieOptions)
			.status(201)
			.json(response.profile);
	};

	private getAuthType = (
		token: string | undefined,
		user: UserDTO,
	): "email" | "provider" | "none" => {
		if (token && user.email === null && user.password === null)
			return "provider";
		if (!token && user.email && user.password) return "email";
		return "none";
	};

	private validateProviderJWT = async (token: string) => {
		const providerId =
			this.tokenService.verifyToken<ProviderJWTPayload>(token)?.providerId;
		if (!providerId) {
			throw new HttpError(400, "Token is invalid");
		}
		return providerId;
	};

	redirect = async (req: Request, res: Response) => {
		// МОК ТИПА ПРОВАЙДЕР ПЕРЕДАЛ РЕАЛЬНЫЙ OPEN_ID
		const providerId = this.cryptoService.generateProvider();
		const token = await this.tokenService.generateToken({ providerId });
		res.cookie(cookieOauth, token, cookieOptions);
		res
			.status(300)
			.redirect(this.configService.getEnv("REDIRECT_URL") + "?oauth=true");
	};
}
