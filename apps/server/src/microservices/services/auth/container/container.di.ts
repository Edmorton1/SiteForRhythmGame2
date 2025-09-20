import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';
import { AUTH_MICRO_TYPES } from './TYPES.di';
import { MICRO_TYPES } from '../../../config/containers/TYPES.di';
import { AuthService } from '../modules/auth/service/auth.service';
import { AuthRepository } from '../modules/auth/repository/auth.repository';
import { RegistrationRepository } from '../modules/registration/repository/registration.repository';
import { RegistrationService } from '../modules/registration/service/registration.service';
import { GoogleService } from '../modules/google/Google.service';

export const authMicroContainer = new Container({ parent: rootMicroContainer });
authMicroContainer
	.bind<AuthService>(MICRO_TYPES.controllers)
	.to(AuthService)
	.inSingletonScope();

authMicroContainer
	.bind<RegistrationService>(MICRO_TYPES.controllers)
	.to(RegistrationService)
	.inSingletonScope();

authMicroContainer
	.bind<GoogleService>(MICRO_TYPES.controllers)
	.to(GoogleService)
	.inSingletonScope();

authMicroContainer
	.bind<AuthRepository>(AUTH_MICRO_TYPES.repositories.auth)
	.to(AuthRepository)
	.inSingletonScope();

authMicroContainer
	.bind<RegistrationRepository>(AUTH_MICRO_TYPES.repositories.registration)
	.to(RegistrationRepository)
	.inSingletonScope();
