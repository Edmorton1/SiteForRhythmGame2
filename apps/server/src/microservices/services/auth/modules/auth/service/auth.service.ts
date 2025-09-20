import { inject, injectable } from 'inversify';
import { AuthRepository } from '../repository/auth.repository';
import bcrypt from 'bcrypt';
import { BaseService } from '../../../../../config/base.service';
import { AUTH_FUNCTIONS, AUTH_MICRO_TYPES } from '../../../container/TYPES.di';
import { LoginDTO } from '../../../../../../../../../libs/models/schemas/auth';
import { Payload } from '../../../../../../web-server/_declarations/session';
import { UserProfile } from '../../../../../../../../../libs/models/schemas/profile';
// TODO: HttpError - сделать чтобы прокидывалась ошибка
import { HttpError } from '../../../../../../web-server/common/http/http.error';
import { authErrors } from '../../../../../../web-server/modules/auth/errors/CONST';

export type LoginServiceReturn = ReturnType<AuthService['login']>;

console.log('AUTH SERVICE');

@injectable()
export class AuthService extends BaseService {
	constructor(
		@inject(AUTH_MICRO_TYPES.repositories.auth)
		private readonly authRepository: AuthRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: AUTH_FUNCTIONS.login,
				func: this.login,
			},
			{
				name: AUTH_FUNCTIONS.getProfileById,
				func: this.getProfileById,
			},
		]);
	}

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
