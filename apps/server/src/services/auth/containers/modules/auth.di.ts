import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from '../TYPES.di';
import { AuthController } from '../../../../routes/auth/controller/auth.controller';
import { AuthService } from '../../../../routes/auth/service/auth.service';
import { AuthRepository } from '../../../../routes/auth/repository/auth.repository';

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
