import { ContainerModule } from 'inversify';
import { WEB } from './web.di';
import { AuthController } from '../modules/auth/controller/auth.controller';
import { RegistrationController } from '../modules/registration/controller/registration.controller';
import { GoogleController } from '../modules/google/controller/Google.controller';
import { Passport } from '../modules/google/passport';
import { TracksController } from '../modules/tracks/controller/tracks.controller';

export const controllersBindings = new ContainerModule(({ bind }) => {
	bind<AuthController>(WEB.controllers).to(AuthController).inSingletonScope();
	bind<RegistrationController>(WEB.controllers)
		.to(RegistrationController)
		.inSingletonScope();
	bind<GoogleController>(WEB.controllers)
		.to(GoogleController)
		.inSingletonScope();
	bind<TracksController>(WEB.controllers)
		.to(TracksController)
		.inSingletonScope();
	// TODO: Перенести в другое место
	bind<Passport>(WEB.oauth.PassportGoogle).to(Passport).inSingletonScope();
});
