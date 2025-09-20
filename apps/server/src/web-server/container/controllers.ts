import { ContainerModule } from 'inversify';
import { WEB_TYPES } from './TYPES.di';
import { AuthController } from '../modules/auth/controller/auth.controller';
import { RegistrationController } from '../modules/registration/controller/registration.controller';
import { GoogleController } from '../modules/google/controller/Google.controller';
import { Passport } from '../modules/google/passport';

export const controllersBindings = new ContainerModule(({ bind }) => {
	bind<AuthController>(WEB_TYPES.controllers)
		.to(AuthController)
		.inSingletonScope();
	bind<RegistrationController>(WEB_TYPES.controllers)
		.to(RegistrationController)
		.inSingletonScope();
	bind<GoogleController>(WEB_TYPES.controllers)
		.to(GoogleController)
		.inSingletonScope();
	// TODO: Перенести в другое место
	bind<Passport>(WEB_TYPES.oauth.PassportGoogle)
		.to(Passport)
		.inSingletonScope();
});
