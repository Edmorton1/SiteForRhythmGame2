import { AuthService } from "@apps/server/auth/auth.service";
import { Body, Controller, Delete, HttpCode, Post, Res } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { UserDTOSwagger, UserDTOValidation } from "@apps/server/auth/auth.dto";
import { serverPaths } from "@libs/shared/PATHS";
import type { CookieOptions, Response } from "express";

const cookieName = "token";
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	maxAge: 1000 * 60 * 60 * 24,
};

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post(serverPaths.registration)
	@ApiBody({ type: UserDTOSwagger })
	@HttpCode(201)
	public async registration(
		@Body() userDto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	) {
		const token = await this.authService.registration(userDto);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Post(serverPaths.login)
	@ApiBody({ type: UserDTOSwagger })
	public async login(
		@Body() dto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	) {
		console.log(dto);
		const token = await this.authService.login(dto);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Delete(serverPaths.logout)
	public logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie("token");
		return "OK";
	}
}
