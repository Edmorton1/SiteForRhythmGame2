import { inject, injectable } from 'inversify';
import { AuthRepository } from '../repository/auth.repository';
import bcrypt from 'bcrypt';
import { HttpError } from '../../../../../web-server/common/http/http.error';
import { UserProfile } from '../../../../../../../../libs/models/schemas/profile';
import { Payload } from '../../../../../_declarations/session';
import { LoginDTO } from '../../../../../../../../libs/models/schemas/auth';
import { authErrors } from '../errors/CONST';
import { AUTH_TYPES } from '../../../containers/TYPES.di';

@injectable()
export class AuthService {
	constructor(
		@inject(AUTH_TYPES.modules.auth.repository)
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
			throw new HttpError(401, authErrors.INCORRECT_PASSWORD);
		}

		const profile = await this.authRepository.getProfileById(payload.id);
		return { payload, profile };
	};

	getProfileById = async (id: number) => {
		return await this.authRepository.getProfileById(id);
	};
}
