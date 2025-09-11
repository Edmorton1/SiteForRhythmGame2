import { ContainerModule } from 'inversify';
import { TYPES } from '../TYPES';
import { GoogleController } from '../../routes/_google/controller/Google.controller';
import { GoogleRepository } from '../../routes/_google/repository/Google.repository';

export const googleBindings = new ContainerModule(({ bind }) => {
	bind<GoogleController>(TYPES.modules.google.controller).to(GoogleController);
	bind<GoogleRepository>(TYPES.modules.google.repository).to(GoogleRepository);
});
