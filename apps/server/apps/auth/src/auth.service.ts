import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { User } from "../../../../../libs/models/schemas/user";
import { DatabaseService } from "../../../services/db/postgres/database.service";
import { AuthDTO, LoginResponse } from "../../../libs/schemas/auth.dto";
import { DatabaseKysely } from "../../../services/db/postgres/database.type";
import { MicroserviceError } from "../../../libs/common/microservice.error";
import { sql } from "kysely";

interface PayloadDTO {
	id: User["id"];
	role: User["role"];
}

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService,
	) {}

	async registration(authDTO: AuthDTO): Promise<LoginResponse> {
		const { auth, profile: profileDTO } = authDTO;
		if (await this.isInDB("users", "email", auth.email!)) {
			throw new MicroserviceError(
				409,
				"An account with this email already exists.",
			);
		}
		if (await this.isInDB("profiles", "name", profileDTO.name)) {
			throw new MicroserviceError(409, "This nickname is already taken");
		}
		// TODO: Убрать !, сделать интеграцию с провайдером
		// TODO: set many salt
		const hashPassword = await bcrypt.hash(auth.password!, 3);
		const { user, profile } = await this.databaseService.db
			.transaction()
			.execute(async trx => {
				const [roleId] = await trx
					.insertInto("users")
					.values({
						...auth,
						password: hashPassword,
					})
					.returning(["id", "role"])
					.execute();

				const [profile] = await trx
					.insertInto("profiles")
					.values({
						...profileDTO,
						id: roleId.id,
						avatar: null,
					})
					.returningAll()
					.execute();
				return { user: roleId, profile };
			});

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

	// TODO: ПРОВЕРИТЬ ОПТИМИЗАЦИЮ
	private async isInDB<T extends keyof DatabaseKysely>(
		table: T,
		param: keyof DatabaseKysely[T],
		// USER INPUT
		value: string,
	) {
		const { rows } = await sql<{ exists: boolean }>`
		SELECT EXISTS(
			SELECT 1
			FROM ${sql.table(table)}
			WHERE ${sql.ref(String(param))} = ${value}
		)`.execute(this.databaseService.db);

		return rows[0].exists;
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
