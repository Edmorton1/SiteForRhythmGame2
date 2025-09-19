import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from './TYPES.di';
import { AuthService } from '../../../KAFKA/service/example/modules/auth/controller/auth.controller';

export const microserviceBindings = new ContainerModule(({ bind }) => {
	bind<AuthService>(MICRO_TYPES.controllers).to(AuthService).inSingletonScope();
});
