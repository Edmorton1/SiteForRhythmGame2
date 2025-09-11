import { ContainerModule } from 'inversify';
import { TYPES } from '../TYPES';
import { GoogleController } from '../../routes/_google/controller/Google.controller';

export const googleBindings = new ContainerModule(({ bind }) => {
	bind<GoogleController>(TYPES.modules.google.controller).to(GoogleController);
});
