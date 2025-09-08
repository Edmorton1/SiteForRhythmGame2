import { inject, injectable } from "inversify";
import { AuthRepository } from "./auth.repository";
import { TYPES } from "../../containers/TYPES";

@injectable()
export class AuthService {
	constructor(
		@inject(TYPES.modules.auth.repository)
		private readonly SQL: AuthRepository,
	) {}

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
}
