import { UserDTOValidation } from "@apps/server/auth/auth.dto";
import { DatabaseService } from "@apps/server/db/postgres/database.service";
import { User } from "@libs/types/common/database.types";
import {
	ConflictException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import bcrypt from "bcrypt";
import { sql } from "kysely";

type PayloadDTO = { email: User["email"]; id: User["id"]; role: User["role"] };

@Injectable()
export class AuthService {
	constructor(
		private readonly databaseService: DatabaseService,
		private readonly jwtService: JwtService,
	) {}

	public async registration(userDto: UserDTOValidation): Promise<string> {
		console.log(userDto);
		if (await this.isUserInDB(userDto.email)) {
			throw new ConflictException("An account with this email already exists.");
		}
		// FIXME: In future set many
		const hashPassword = await bcrypt.hash(userDto.password, 3);
		const [user] = await this.databaseService.db
			.insertInto("users")
			.values({ email: userDto.email, password: hashPassword, role: "user" })
			.returningAll()
			.execute();
		//@ts-ignore
		return this.generateToken(user);
	}

	public async login(userDto: UserDTOValidation) {
		const [user] = await this.databaseService.db
			.selectFrom("users")
			.selectAll()
			.where("email", "=", userDto.email)
			.execute();
		if (!user) {
			throw new UnauthorizedException("This email doesn't exist");
		}
		// FIXME: In future add provider checking
		//@ts-ignore
		if (!(await bcrypt.compare(userDto.password, user.password!))) {
			throw new UnauthorizedException("The passwords do not match");
		}
		//@ts-ignore
		const token = await this.generateToken(user);
		return token;
	}

	private generateToken(user: PayloadDTO) {
		const payload = { email: user.email, id: user.id, role: user.role };
		return this.jwtService.sign(payload);
	}

	private async isUserInDB(email: string) {
		const { rows } = await sql<{ exists: boolean }>`
		SELECT EXISTS(
			SELECT 1
			FROM users
			WHERE email = ${email}
		)`.execute(this.databaseService.db);

		return rows[0].exists;
	}
}
