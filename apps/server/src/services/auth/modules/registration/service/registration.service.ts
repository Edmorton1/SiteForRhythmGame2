import { RegistrationRepository } from '../repository/registration.repository';
import { inject, injectable } from 'inversify';
import { registrationErrors } from '../errors/CONST';
import { AUTH_TYPES } from '../../../containers/TYPES.di';
import { RegistrationDTO } from '../../../../../common/models/schemas/registration.dto';
import { Provider } from '../../../../../_declarations/session';
import { Profile } from '../../../../../../../../libs/models/schemas/profile';
import { HttpError } from '../../../../../common/http/http.error';
import { UserDTO } from '../../../../../../../../libs/models/schemas/user';

@injectable()
export class RegistrationService {
	constructor(
		@inject(AUTH_TYPES.modules.registration.repository)
		private readonly registrationSQL: RegistrationRepository,
	) {}

	registration = async (
		authDTO: RegistrationDTO,
		provider: Provider | undefined,
	): Promise<Profile> => {
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

		return await this.registrationSQL.registrationEmail(authDTO);
	};

	private registrationWithProvider = async (
		authDTO: Omit<RegistrationDTO, 'user'>,
		provider: Provider,
	): Promise<Profile> => {
		await this.isNameIsFree(authDTO.profile.name);

		return await this.registrationSQL.registrationProvider(authDTO, provider);
	};

	private isEmailIsFree = async (email: string) => {
		if (await this.registrationSQL.isInDB('users', 'email', email)) {
			throw new HttpError(409, registrationErrors.EMAIL_TAKEN);
		}
	};

	private isNameIsFree = async (name: string) => {
		if (await this.registrationSQL.isInDB('profiles', 'name', name)) {
			throw new HttpError(409, registrationErrors.NICKNAME_TAKEN);
		}
	};
}
