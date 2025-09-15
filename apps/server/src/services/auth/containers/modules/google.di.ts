import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from '../TYPES.di';
import { GoogleController } from '../../../../routes/google/controller/Google.controller';
import { GoogleRepository } from '../../../../routes/google/repository/Google.repository';
import { Passport } from '../../../../routes/google/passport';

export const googleBindings = new ContainerModule(({ bind }) => {
	bind<GoogleController>(AUTH_TYPES.modules.google.controller).to(
		GoogleController,
	);
	bind<GoogleRepository>(AUTH_TYPES.modules.google.repository).to(
		GoogleRepository,
	);
	bind<Passport>(AUTH_TYPES.oauth.PassportGoogle)
		.to(Passport)
		.inSingletonScope();
});
