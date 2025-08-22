// prettier-ignore
import { Body, Controller, Delete, Get, HttpCode, Inject, Post, Res, UploadedFile, UseInterceptors, ValidationError } from "@nestjs/common";
import type { CookieOptions, Response } from "express";
import { ClientProxy } from "@nestjs/microservices";
import { AUTH } from "../SERVICE_NAMES";
import { HttpController } from "../../../../libs/common/http.controller";
//prettier-ignore
import { type AuthDTO, AuthDTOValidation, LoginResponse } from "../../../../libs/schemas/auth.dto";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { FileInterceptor } from "@nestjs/platform-express";

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
		@UploadedFile() file: Express.Multer.File,
		@Body() data: AuthDTO,
		@Res({ passthrough: true }) res: Response,
	): Promise<LoginResponse> {
		// try {
		// 	JSON.parse(data.data)
		// } catch {
		// 	throw new ValidationError
		// }
		// UserZodSchema.parse(data);
		// console.log(data, file);
		// const response = await this.messenger.send<LoginResponse>(
		// 	serverPaths.registration,
		// 	data,
		// );

		// res.cookie(cookieName, response.token, cookieOptions);
		return data;
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
