// prettier-ignore
import { Body, Controller, HttpCode, Inject, Post, Res, UploadedFile, UseInterceptors } from "@nestjs/common";
import type { CookieOptions, Response } from "express";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH } from "../SERVICE_NAMES";
import { HttpController } from "../../../../libs/common/http.controller";
//prettier-ignore
import { AuthDTOZodSchema, LoginResponse } from "../../../../libs/models/schemas/auth.dto";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { FileInterceptor } from "@nestjs/platform-express";
import { Profile } from "../../../../../../libs/models/schemas/profile";
import { zodValidateFormData } from "../../../../libs/common/zod.validate.formdata";

const cookieName = "token";
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	maxAge: 1000 * 60 * 60 * 24,
};

@Controller()
export class AuthController extends HttpController {
	constructor(@Inject(AUTH) client: ClientProxy) {
		super(client);
	}

	@Post(serverPaths.registration)
	@HttpCode(201)
	@UseInterceptors(FileInterceptor("avatar"))
	async registration(
		@UploadedFile() avatar: Express.Multer.File,
		@Body() data: unknown,
		@Res({ passthrough: true }) res: Response,
	): Promise<Profile> {
		const authDTO = zodValidateFormData({
			data,
			name: "data",
			schema: AuthDTOZodSchema,
			files: { avatar },
		});
		const response = await this.messenger.send<LoginResponse>(
			serverPaths.registration,
			authDTO,
		);

		res.cookie(cookieName, response.token, cookieOptions);
		return response.profile;
	}

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
