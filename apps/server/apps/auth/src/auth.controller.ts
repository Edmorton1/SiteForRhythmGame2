import { AuthService } from "./auth.service";
import { Controller } from "@nestjs/common";
import { UserDTOValidation } from "./auth.dto";
import { serverPaths } from "@libs/shared/PATHS";
import { MessagePattern } from "@nestjs/microservices";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern(serverPaths.registration)
	async registration(userDto: UserDTOValidation): Promise<string> {
		console.log("REGISTRATION AUTH CONTROLLER");
		return this.authService.registration(userDto);
	}

	@MessagePattern(serverPaths.login)
	async login(userDto: UserDTOValidation): Promise<string> {
		console.log(userDto);
		return this.authService.login(userDto);
	}

	@MessagePattern("test")
	test() {
		return "sadasdads";
	}
}
