import { ContainerModule } from 'inversify';
import { TracksController } from '../controllers/tracks/tracks.controller';
import { GATEWAY_TYPES } from './TYPES.di';

export const controllerBindings = new ContainerModule(({ bind }) => {
	bind<TracksController>(GATEWAY_TYPES.modules.tracks.controller)
		.to(TracksController)
		.inSingletonScope();
});
