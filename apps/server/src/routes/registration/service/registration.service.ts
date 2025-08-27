//prettier-ignore
import { AuthDTO, LoginResponse, ProviderJWTPayload } from "../../../common/models/schemas/auth.dto";
import { injectable } from "tsyringe";
import { RegistrationRepository } from "../repository/registration.repository";
import { HttpError } from "../../../common/http/http.error";
import { TokenService } from "../token.service";
import { UserDTO } from "../../../../../../libs/models/schemas/user";
import { CryptoService } from "../../../common/services/crypto/crypto.service";

@injectable()
export class RegistrationService {
	constructor(
		private readonly registrationSQL: RegistrationRepository,
		private readonly tokenService: TokenService,
		private readonly cryptoService: CryptoService,
	) {}

	registration = async (
		authDTO: AuthDTO,
		token: string | undefined,
	): Promise<LoginResponse> => {
		const { user, ...profileDTO } = authDTO;
		const authType = this.getAuthType(token, user);
		if (authType === "email") {
			return await this.registrationWithEmail(authDTO);
		} else if (authType === "provider") {
			// TODO: REMOVE !
			const providerId = await this.validateProviderJWT(token!);
			return await this.registrationWithProvider(profileDTO, providerId);
		} else {
			throw new HttpError(
				400,
				"There can't be a token, email and password at the same time, choose one authorization method",
			);
		}
	};

	redirect = () => {
		const providerId = this.cryptoService.generateProvider();
		return this.tokenService.generateToken({ providerId });
	};

	private validateProviderJWT = async (token: string) => {
		const providerId =
			this.tokenService.verifyToken<ProviderJWTPayload>(token)?.providerId;
		if (!providerId) {
			throw new HttpError(400, "Token is invalid");
		}
		return providerId;
	};

	private getAuthType = (
		token: string | undefined,
		user: UserDTO,
	): "email" | "provider" | "none" => {
		if (token && user.email === null && user.password === null)
			return "provider";
		if (!token && user.email && user.password) return "email";
		return "none";
	};

	private registrationWithEmail = async (
		authDTO: AuthDTO,
	): Promise<LoginResponse> => {
		await this.isEmailIsFree(authDTO.user.email!);
		await this.isNameIsFree(authDTO.profile.name);

		const { JWTPayload, profile } =
			await this.registrationSQL.registrationEmail(authDTO);

		const token = this.tokenService.generateToken(JWTPayload);
		return { token, profile };
	};

	private registrationWithProvider = async (
		authDTO: Omit<AuthDTO, "user">,
		providerId: string,
	): Promise<LoginResponse> => {
		await this.isNameIsFree(authDTO.profile.name);

		const { JWTPayload, profile } =
			await this.registrationSQL.registrationProvider(authDTO, providerId);

		const token = this.tokenService.generateToken(JWTPayload);
		return { token, profile };
	};

	private isEmailIsFree = async (email: string) => {
		if (await this.registrationSQL.isInDB("users", "email", email)) {
			throw new HttpError(409, "An account with this email already exists.");
		}
	};

	private isNameIsFree = async (name: string) => {
		if (await this.registrationSQL.isInDB("profiles", "name", name)) {
			throw new HttpError(409, "This nickname is already taken");
		}
	};
}
