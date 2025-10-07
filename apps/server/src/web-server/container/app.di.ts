import { ContainerModule } from 'inversify';
import { WEB_TYPES } from './TYPES.di';
import { ControllerCollector } from '../config/controllers/controller.collector';
import { ServerExpress } from '../config/server/server';
import { ExpressError } from '../config/middlewares/express.error';
import { ExpressSession } from '../config/middlewares/express.session';
import { KafkaWebServer } from '../config/kafka.webserver';

export const appBindings = new ContainerModule(({ bind }) => {
	bind<ControllerCollector>(WEB_TYPES.app.ControllerCollector)
		.to(ControllerCollector)
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
	bind<KafkaWebServer>(WEB_TYPES.app.KafkaWebServer)
		.to(KafkaWebServer)
		.inSingletonScope();
});
