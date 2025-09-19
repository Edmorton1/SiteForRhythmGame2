import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from '../../../microservices/config/containers/TYPES.di';
import { AuthService } from '../example/modules/auth/controller/auth.controller';

export const microserviceBindings = new ContainerModule(({ bind }) => {
	bind<AuthService>(MICRO_TYPES.controllers).to(AuthService).inSingletonScope();
});
