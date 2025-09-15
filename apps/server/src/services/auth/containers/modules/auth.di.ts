import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from '../TYPES.di';
import { AuthService } from '../../modules/auth/service/auth.service';
import { AuthRepository } from '../../modules/auth/repository/auth.repository';
import { AuthController } from '../../modules/auth/controller/auth.controller';

export const authBindings = new ContainerModule(({ bind }) => {
	bind<AuthController>(AUTH_TYPES.modules.auth.controller)
		.to(AuthController)
		.inSingletonScope();
	bind<AuthService>(AUTH_TYPES.modules.auth.service)
		.to(AuthService)
		.inSingletonScope();
	bind<AuthRepository>(AUTH_TYPES.modules.auth.repository)
		.to(AuthRepository)
		.inSingletonScope();
});
