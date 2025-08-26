//prettier-ignore
import { AuthDTOZodSchema } from "../../common/models/schemas/auth.dto";
import { AuthService } from "./auth.service";
import { zodValidateFormData } from "../../common/pipes/zod.formdata.pipe";
import { injectable } from "tsyringe";
import { CookieOptions, Request, Response } from "express";
import multer from "multer";
import { BaseController } from "../../config/server/base.controller";

const cookieName = "token";
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	maxAge: 1000 * 60 * 60 * 24,
};

@injectable()
export class AuthController extends BaseController {
	// @Post(serverPaths.registration)
	// @HttpCode(201)
	// @UseInterceptors(FileInterceptor("avatar"))
	// async registration(
	// 	@UploadedFile() avatar: Express.Multer.File,
	// 	@Body() data: unknown,
	// 	@Res({ passthrough: true }) res: Response,
	// ): Promise<Profile> {
	// 	const authDTO = zodValidateFormData({
	// 		data,
	// 		name: "data",
	// 		schema: AuthDTOZodSchema,
	// 		files: { avatar },
	// 	});
	// 	const response = await this.messenger.send<LoginResponse>(
	// 		serverPaths.registration,
	// 		authDTO,
	// 	);

	// 	res.cookie(cookieName, response.token, cookieOptions);
	// 	return response.profile;
	// }
	constructor(private readonly authService: AuthService) {
		super();
		this.bindRoutes([
			{
				handle: this.registration,
				method: "post",
				path: "/registration",
				middlewares: [multer({}).single("avatar")],
			},
		]);
	}

	registration = async (req: Request, res: Response) => {
		const authDTO = zodValidateFormData({
			data: req.body,
			name: "data",
			schema: AuthDTOZodSchema,
			// files: { avatar },
		});
		const response = await this.authService.registration(authDTO as any);
		res.cookie(cookieName, cookieOptions).status(201).json(response);
	};

	// @Post(serverPaths.login)
	// login(
	// 	@Body() userDto: AuthDTOValidation,
	// 	@Res({ passthrough: true }) res: Response,
	// ) {
	// 	const token = this.messenger.send(serverPaths.login, userDto);
	// 	res.cookie(cookieName, token, cookieOptions);
	// 	return token;
	// }

	// @Delete(serverPaths.logout)
	// logout(@Res({ passthrough: true }) res: Response): string {
	// 	res.clearCookie("token");
	// 	return "OK";
	// }
}
