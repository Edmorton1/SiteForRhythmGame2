// prettier-ignore
import { Body, Controller, Delete, Get, HttpCode, Inject, Post, Res } from "@nestjs/common";
import { ApiBody } from "@nestjs/swagger";
import { UserDTOSwagger, UserDTOValidation } from "./auth.dto";
import { serverPaths } from "@libs/shared/PATHS";
import type { CookieOptions, Response } from "express";
import { HttpController } from "@server/libs/common/http.controller";
import { ClientProxy } from "@nestjs/microservices";
import { clientName } from "apps/api/src/_CONST";

const cookieName = "token";
const cookieOptions: CookieOptions = {
	httpOnly: true,
	secure: true,
	sameSite: "strict",
	maxAge: 1000 * 60 * 60 * 24,
};

@Controller()
export class ApiController extends HttpController {
	constructor(@Inject(clientName) client: ClientProxy) {
		super(client);
	}

	@Post(serverPaths.registration)
	@ApiBody({ type: UserDTOSwagger })
	@HttpCode(201)
	async registration(
		@Body() userDto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	) {
		console.log("REGISTRATION API CONTROLLER");
		const token = await this.messenger.send(serverPaths.registration, userDto);
		console.log(token);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Post(serverPaths.login)
	@ApiBody({ type: UserDTOSwagger })
	login(
		@Body() userDto: UserDTOValidation,
		@Res({ passthrough: true }) res: Response,
	) {
		console.log(userDto);
		const token = this.messenger.send(serverPaths.login, userDto);
		res.cookie(cookieName, token, cookieOptions);
		return true;
	}

	@Delete(serverPaths.logout)
	logout(@Res({ passthrough: true }) res: Response): string {
		res.clearCookie("token");
		return "OK";
	}

	@Get("test")
	test() {
		return this.messenger.send("test");
	}
}
