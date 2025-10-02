import { inject, injectable } from 'inversify';
import { AuthRepository } from '../repository/auth.repository';
import bcrypt from 'bcrypt';
import { BaseService } from '../../../../../config/base.service';
import { LoginDTO } from '../../../../../../../../../libs/models/schemas/auth';
// TODO: HttpError - сделать чтобы прокидывалась ошибка
import { HttpError } from '../../../../../../common/http/http.error';
import { authErrors } from '../../../../../../common/modules/auth/errors/auth';
import { LoginServiceReturn } from '../../../../../../common/modules/auth/auth.micro.types';
import { AUTH_MICRO_TYPES } from '../../../container/TYPES.di';
import { AUTH_FUNCTIONS } from '../../../../../../common/modules/auth/auth.functions';

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

	login = async (userDTO: LoginDTO): Promise<LoginServiceReturn> => {
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
