import { AuthService } from "@apps/server/auth_old/auth.service";
import { Body, Controller, Delete, HttpCode, Post, Res } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
//prettier-ignore
import { UserDTOSwagger, UserDTOValidation } from "@apps/server/auth_old/auth.dto";
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
	async registration(
		@Body() userDto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	): Promise<boolean> {
		const token = await this.authService.registration(userDto);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Post(serverPaths.login)
	@ApiBody({ type: UserDTOSwagger })
	async login(
		@Body() dto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	): Promise<boolean> {
		console.log(dto);
		const token = await this.authService.login(dto);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Delete(serverPaths.logout)
	logout(@Res({ passthrough: true }) res: Response): string {
		res.clearCookie("token");
		return "OK";
	}
}
