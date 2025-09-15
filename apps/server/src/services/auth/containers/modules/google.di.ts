import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from '../TYPES.di';
import { Passport } from '../../modules/google/passport';
import { GoogleController } from '../../modules/google/controller/Google.controller';
import { GoogleRepository } from '../../modules/google/repository/Google.repository';

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
