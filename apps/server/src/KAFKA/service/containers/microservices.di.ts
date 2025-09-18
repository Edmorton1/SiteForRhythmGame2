import { ContainerModule } from 'inversify';
import { MICRO_TYPES } from '../TYPES.di';
import { AuthService } from '../services/auth.service';
import { TrackService } from '../services/track.service';

export const microserviceBindings = new ContainerModule(({ bind }) => {
	bind<TrackService>(MICRO_TYPES.microservices.tracks)
		.to(TrackService)
		.inSingletonScope();
	bind<AuthService>(MICRO_TYPES.microservices.auth)
		.to(AuthService)
		.inSingletonScope();
});
