import { ContainerModule } from 'inversify';
import { COMMON_TYPES } from './TYPES.di';
import { ServerRoutes } from '../config/server.routes';
import { ExpressError } from '../config/middlewares/express.error';
import { ServerExpress } from '../config/server.express';
import { ExpressSession } from '../config/middlewares/express.session';

export const appBindings = new ContainerModule(({ bind }) => {
	bind<ServerRoutes>(COMMON_TYPES.app.ServerRoutes)
		.to(ServerRoutes)
		.inSingletonScope();
	bind<ExpressError>(COMMON_TYPES.app.ExpressError)
		.to(ExpressError)
		.inSingletonScope();
	bind<ExpressSession>(COMMON_TYPES.app.ExpressSession)
		.to(ExpressSession)
		.inSingletonScope();
	bind<ServerExpress>(COMMON_TYPES.app.ServerExpress)
		.to(ServerExpress)
		.inSingletonScope();
});
