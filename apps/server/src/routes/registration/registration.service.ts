import { AuthDTO, LoginResponse } from "../../common/models/schemas/auth.dto";
import { injectable } from "tsyringe";
import { RegistrationSQL } from "./registration.sql";
import { HttpError } from "../../common/http/http.error";
import { TokenService } from "./token.service";

@injectable()
export class RegistrationService {
	constructor(
		private readonly authSQL: RegistrationSQL,
		private readonly tokenService: TokenService,
	) {}

	registrationWithEmail = async (authDTO: AuthDTO): Promise<LoginResponse> => {
		await this.isEmailIsFree(authDTO.user.email!);
		await this.isNameIsFree(authDTO.profile.name);

		const { JWTPayload, profile } =
			await this.authSQL.registrationEmail(authDTO);

		const token = this.tokenService.generateToken(JWTPayload);
		return { token, profile };
	};

	registrationWithProvider = async (
		authDTO: Omit<AuthDTO, "user">,
		providerId: string,
	): Promise<LoginResponse> => {
		await this.isNameIsFree(authDTO.profile.name);

		const { JWTPayload, profile } = await this.authSQL.registrationProvider(
			authDTO,
			providerId,
		);

		const token = this.tokenService.generateToken(JWTPayload);
		return { token, profile };
	};

	private isEmailIsFree = async (email: string) => {
		if (await this.authSQL.isInDB("users", "email", email)) {
			throw new HttpError(409, "An account with this email already exists.");
		}
	};

	private isNameIsFree = async (name: string) => {
		if (await this.authSQL.isInDB("profiles", "name", name)) {
			throw new HttpError(409, "This nickname is already taken");
		}
	};
}
