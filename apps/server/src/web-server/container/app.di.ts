import { ContainerModule } from 'inversify';
import { WEB_TYPES } from './TYPES.di';
import { ServerRoutes } from '../config/server.routes';
import { ServerExpress } from '../config/server';
import { ExpressError } from '../config/middlewares/express.error';
import { ExpressSession } from '../config/middlewares/express.session';

export const appBindings = new ContainerModule(({ bind }) => {
	bind<ServerRoutes>(WEB_TYPES.app.ServerRoutes)
		.to(ServerRoutes)
		.inSingletonScope();
	bind<ExpressError>(WEB_TYPES.app.ExpressError)
		.to(ExpressError)
		.inSingletonScope();
	bind<ExpressSession>(WEB_TYPES.app.ExpressSession)
		.to(ExpressSession)
		.inSingletonScope();
	bind<ServerExpress>(WEB_TYPES.app.ServerExpress)
		.to(ServerExpress)
		.inSingletonScope();
});
