import { inject, injectable } from 'inversify';
import { AuthRepository } from '../repository/auth.repository';
import bcrypt from 'bcrypt';
import { BaseService } from '../../../../../config/service/base.service';
import { HttpError } from '../../../../../../common/http/http.error';
import { authErrors } from '../../../../../../common/modules/auth/errors/auth';
import { AUTH } from '../../../container/auth.types';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../../../common/modules/auth/auth.functions';

console.log('AUTH SERVICE');

@injectable()
export class AuthService extends BaseService {
	constructor(
		@inject(AUTH.repositories.auth)
		private readonly authRepository: AuthRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: AUTH_KEYS.login,
				func: this.login,
			},
			{
				name: AUTH_KEYS.init,
				func: this.init,
			},
		]);
	}

	login = async (
		userDTO: AUTH_FUNCTIONS['login']['input'],
	): Promise<AUTH_FUNCTIONS['login']['output']> => {
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

	init = async (
		id: AUTH_FUNCTIONS['init']['input'],
	): Promise<AUTH_FUNCTIONS['init']['output']> => {
		return await this.authRepository.getProfileById(id);
	};
}
