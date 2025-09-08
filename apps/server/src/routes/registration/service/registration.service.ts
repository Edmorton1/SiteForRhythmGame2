import { AuthDTO } from "../../../common/models/schemas/auth.dto";
import { RegistrationRepository } from "../repository/registration.repository";
import { HttpError } from "../../../common/http/http.error";
import { UserDTO } from "../../../../../../libs/models/schemas/user";
import { CryptoService } from "../../../common/services/crypto/crypto.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../containers/TYPES";
import { Profile } from "../../../../../../libs/models/schemas/profile";

@injectable()
export class RegistrationService {
	constructor(
		@inject(TYPES.modules.registration.repository)
		private readonly registrationSQL: RegistrationRepository,
		@inject(TYPES.services.crypto)
		private readonly cryptoService: CryptoService,
	) {}

	registration = async (
		authDTO: AuthDTO,
		providerId: string | undefined,
	): Promise<Profile> => {
		const { user, ...profileDTO } = authDTO;
		const authType = this.getAuthType(providerId, user);
		if (authType === "email") {
			return await this.registrationWithEmail(authDTO);
		} else if (authType === "provider") {
			return await this.registrationWithProvider(profileDTO, providerId!);
		} else {
			throw new HttpError(
				400,
				"There can't be a token, email and password at the same time, choose one authorization method",
			);
		}
	};

	redirect = () => {
		return this.cryptoService.generateProvider();
	};

	private getAuthType = (
		providerId: string | undefined,
		user: UserDTO,
	): "email" | "provider" | "none" => {
		if (providerId && user.email === null && user.password === null)
			return "provider";
		if (!providerId && user.email && user.password) return "email";
		return "none";
	};

	private registrationWithEmail = async (
		authDTO: AuthDTO,
	): Promise<Profile> => {
		await this.isEmailIsFree(authDTO.user.email!);
		await this.isNameIsFree(authDTO.profile.name);

		return await this.registrationSQL.registrationEmail(authDTO);
	};

	private registrationWithProvider = async (
		authDTO: Omit<AuthDTO, "user">,
		providerId: string,
	): Promise<Profile> => {
		await this.isNameIsFree(authDTO.profile.name);

		return await this.registrationSQL.registrationProvider(authDTO, providerId);
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
