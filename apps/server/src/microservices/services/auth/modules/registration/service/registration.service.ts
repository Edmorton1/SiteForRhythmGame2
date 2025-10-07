import { RegistrationRepository } from '../repository/registration.repository';
import { inject, injectable } from 'inversify';
import { registrationErrors } from '../../../../../../common/modules/auth/errors/registration';
import { RegistrationDTO } from '../../../../../../common/models/schemas/registration.dto';
import { Provider } from '../../../../../../common/_declarations/session';
import { Profile } from '../../../../../../../../../libs/models/schemas/profile';
import { HttpError } from '../../../../../../common/http/http.error';
import { UserDTO } from '../../../../../../../../../libs/models/schemas/user';
import { BaseService } from '../../../../../config/service/base.service';
import { AUTH } from '../../../container/auth.types';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../../../common/modules/auth/auth.functions';

@injectable()
export class RegistrationService extends BaseService {
	constructor(
		@inject(AUTH.repositories.registration)
		private readonly registrationRepository: RegistrationRepository,
	) {
		super();
		this.bindFunctions([
			{
				name: AUTH_KEYS.registration,
				func: this.registration,
			},
		]);
	}

	registration = async (
		props: AUTH_FUNCTIONS['registration']['input'],
	): Promise<AUTH_FUNCTIONS['registration']['output']> => {
		const { authDTO, provider } = props;
		const { user, ...profileDTO } = authDTO;
		const authType = this.getAuthType(provider, user);
		switch (authType) {
			case 'email':
				return await this.registrationWithEmail(authDTO);
			case 'provider':
				return await this.registrationWithProvider(profileDTO, provider!);
			case 'none':
				throw new HttpError(400, registrationErrors.AUTH_METHOD);
		}
	};

	private getAuthType = (
		provider: Provider | undefined,
		user: UserDTO,
	): 'email' | 'provider' | 'none' => {
		if (provider && user.email === null && user.password === null)
			return 'provider';
		if (!provider && user.email && user.password) return 'email';
		return 'none';
	};

	private registrationWithEmail = async (
		authDTO: RegistrationDTO,
	): Promise<Profile> => {
		await this.isEmailIsFree(authDTO.user.email!);
		await this.isNameIsFree(authDTO.profile.name);

		return await this.registrationRepository.registrationEmail(authDTO);
	};

	private registrationWithProvider = async (
		authDTO: Omit<RegistrationDTO, 'user'>,
		provider: Provider,
	): Promise<Profile> => {
		await this.isNameIsFree(authDTO.profile.name);

		return await this.registrationRepository.registrationProvider(
			authDTO,
			provider,
		);
	};

	private isEmailIsFree = async (email: string) => {
		if (await this.registrationRepository.isInDB('users', 'email', email)) {
			throw new HttpError(409, registrationErrors.EMAIL_TAKEN);
		}
	};

	private isNameIsFree = async (name: string) => {
		if (await this.registrationRepository.isInDB('profiles', 'name', name)) {
			throw new HttpError(409, registrationErrors.NICKNAME_TAKEN);
		}
	};
}
