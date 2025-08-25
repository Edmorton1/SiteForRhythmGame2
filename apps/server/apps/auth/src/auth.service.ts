import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { User } from "../../../../../libs/models/schemas/user";
import { AuthDTO, LoginResponse } from "../../../libs/models/schemas/auth.dto";
import { MicroserviceError } from "../../../libs/common/microservice.error";
import { AuthSQL } from "./auth.sql";

interface PayloadDTO {
	id: User["id"];
	role: User["role"];
}

@Injectable()
export class AuthService {
	constructor(
		private readonly jwtService: JwtService,
		private readonly authSQL: AuthSQL,
	) {}

	async registration(authDTO: AuthDTO): Promise<LoginResponse> {
		const { user: auth, profile: profileDTO } = authDTO;
		if (await this.authSQL.isInDB("users", "email", auth.email!)) {
			throw new MicroserviceError(
				409,
				"An account with this email already exists.",
			);
		}
		if (await this.authSQL.isInDB("profiles", "name", profileDTO.name)) {
			throw new MicroserviceError(409, "This nickname is already taken");
		}
		// TODO: Убрать !, сделать интеграцию с провайдером
		// TODO: set many salt
		const { user, profile } = await this.authSQL.registration(authDTO);

		const token = this.generateToken(user);
		return { token, profile };
	}

	// async login(userDto: AuthDTO): Promise<string> {
	// 	const [user] = await this.databaseService.db
	// 		.selectFrom("users")
	// 		.selectAll()
	// 		.where("email", "=", userDto.email)
	// 		.execute();
	// 	if (!user) {
	// 		throw new UnauthorizedException("This email doesn't exist");
	// 	}
	// 	// TODO: add provider checking
	// 	if (!(await bcrypt.compare(userDto.password, user.password!))) {
	// 		throw new UnauthorizedException("The passwords do not match");
	// 	}
	// 	const token = this.generateToken(user);
	// 	return token;
	// }

	private generateToken(user: PayloadDTO) {
		const payload = { id: user.id, role: user.role };
		return this.jwtService.sign(payload);
	}
}

// 	private async isInDB<T extends keyof DatabaseKysely>(
// 		table: T,
// 		param: keyof DatabaseKysely[T],
// 		// USER
// 		value: string,
// 	) {
// const { rows } = await sql<{ exists: boolean }>`
// SELECT EXISTS(
// 	SELECT 1
// 	FROM ${table}
// 	WHERE ${param} = ${value}
// )`.execute(this.databaseService.db);

// 		return rows[0].exists;
// 	}
// }
