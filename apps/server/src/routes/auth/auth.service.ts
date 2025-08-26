import { User } from "../../../../../libs/models/schemas/user";
//prettier-ignore
import { AuthDTO, LoginResponse } from "../../common/models/schemas/auth.dto";
import { injectable } from "tsyringe";
import { AuthSQL } from "./auth.sql";
import jwt from "jsonwebtoken";
import { ConfigService } from "../../common/services/config/config.service";
import { HttpError } from "../../common/http/http.error";

interface PayloadDTO {
	id: User["id"];
	role: User["role"];
}

@injectable()
export class AuthService {
	constructor(
		private readonly authSQL: AuthSQL,
		private readonly configService: ConfigService,
	) {}

	registration = async (authDTO: AuthDTO): Promise<LoginResponse> => {
		const { user: auth, profile: profileDTO } = authDTO;
		if (await this.authSQL.isInDB("users", "email", auth.email!)) {
			throw new HttpError(409, "An account with this email already exists.");
		}
		if (await this.authSQL.isInDB("profiles", "name", profileDTO.name)) {
			throw new HttpError(409, "This nickname is already taken");
		}
		// TODO: Убрать !, сделать интеграцию с провайдером
		// TODO: set many salt
		const { user, profile } = await this.authSQL.registration(authDTO);

		const token = this.generateToken(user);
		return { token, profile };
	};

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

	private generateToken = (user: PayloadDTO) => {
		const payload = { id: user.id, role: user.role };
		// return this.jwtService.sign(payload);
		return jwt.sign(payload, this.configService.getEnv("JWT_SECRET"));
	};
}
