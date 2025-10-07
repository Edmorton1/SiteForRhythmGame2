import { ContainerModule } from 'inversify';
import { AUTH } from './auth.types';
import { MICRO } from '../../../config/containers/micro.types';
import { AuthService } from '../modules/auth/service/auth.service';
import { AuthRepository } from '../modules/auth/repository/auth.repository';
import { RegistrationRepository } from '../modules/registration/repository/registration.repository';
import { RegistrationService } from '../modules/registration/service/registration.service';
import { GoogleService } from '../modules/google/Google.service';

export const authBindings = new ContainerModule(({ bind }) => {
	bind<AuthService>(MICRO.controllers).to(AuthService).inSingletonScope();

	bind<RegistrationService>(MICRO.controllers)
		.to(RegistrationService)
		.inSingletonScope();

	bind<GoogleService>(MICRO.controllers).to(GoogleService).inSingletonScope();

	bind<AuthRepository>(AUTH.repositories.auth)
		.to(AuthRepository)
		.inSingletonScope();

	bind<RegistrationRepository>(AUTH.repositories.registration)
		.to(RegistrationRepository)
		.inSingletonScope();
});
