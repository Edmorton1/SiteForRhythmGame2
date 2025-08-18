import { Controller, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "@server/services/db/postgres/database.module";

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get()
	getHello(): any {
		console.log(this.authService);
		console.log(DatabaseModule);
		return DatabaseModule;
		// return DatabaseModule
	}
}
