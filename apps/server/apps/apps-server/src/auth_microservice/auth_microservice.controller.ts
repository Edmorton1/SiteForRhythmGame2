import { Controller } from "@nestjs/common";
import { UserDTOValidation } from "@apps/server/auth_old/auth.dto";
import { serverPaths } from "@libs/shared/PATHS";
import { AuthMicroserviceService } from "@apps/server/auth_microservice/auth_microservice.service";
import { MessagePattern } from "@nestjs/microservices";
import { DatabaseService } from "@server/services/db/postgres/database.service";

@Controller()
export class AuthMicroserviceController {
	constructor(
		private readonly authMicroserviceService: AuthMicroserviceService,
		private readonly db: DatabaseService,
	) {}

	@MessagePattern("findAll")
	async findAll() {
		return await this.db.db.selectFrom("users").selectAll().execute();
	}

	@MessagePattern(serverPaths.registration)
	async registration(userDto: UserDTOValidation) {
		const token = await this.authMicroserviceService.registration(userDto);
		return token;
	}
}
