import { injectable } from "tsyringe";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { BaseController } from "../../config/server/base.controller";
import { serverPaths } from "../../../../../libs/shared/PATHS";

@injectable()
export class AuthController extends BaseController {
	constructor(private readonly service: AuthService) {
		super();
		this.bindRoutes([
			{
				handle: this.login,
				method: "get",
				path: serverPaths.login,
			},
		]);
	}

	login = async (req: Request, res: Response) => {};

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
