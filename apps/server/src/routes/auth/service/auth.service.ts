import { inject, injectable } from "inversify";
import { AuthRepository } from "../repository/auth.repository";
import { TYPES } from "../../../containers/TYPES";
import bcrypt from "bcrypt";
import { LoginDTO } from "../_schemas/auth.schemas";
import { HttpError } from "../../../common/http/http.error";
import { UserProfile } from "../../../../../../libs/models/schemas/profile";
import { Payload } from "../../../common/models/schemas/auth.dto";

@injectable()
export class AuthService {
	constructor(
		@inject(TYPES.modules.auth.repository)
		private readonly authRepository: AuthRepository,
	) {}

	login = async (
		userDTO: LoginDTO,
	): Promise<{ payload: Payload; profile: UserProfile }> => {
		const { password, ...payload } = await this.authRepository.getPassword(
			userDTO.email,
		);
		const isPasswordCorrect = await bcrypt.compare(userDTO.password, password);

		if (!isPasswordCorrect) {
			throw new HttpError(401, "Password is incorrect");
		}

		const profile = await this.authRepository.getProfileById(payload.id);
		return { payload, profile };
	};

	getProfileById = async (id: number) => {
		return await this.authRepository.getProfileById(id);
	};
}
