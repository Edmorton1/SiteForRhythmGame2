import { ContainerModule } from 'inversify';
import { WEB } from './web.di';
import { ControllerCollector } from '../config/controllers/controller.collector';
import { ServerWeb } from '../config/server/server';
import { KafkaLoader } from '../config/kafka/kafka.loader';
import { ErrorMiddleware } from '../config/middlewares/error.middleware';
import { SessionMiddleware } from '../config/middlewares/session.middleware';

export const appBindings = new ContainerModule(({ bind }) => {
	bind<ControllerCollector>(WEB.app.ControllerCollector)
		.to(ControllerCollector)
		.inSingletonScope();
	bind<ErrorMiddleware>(WEB.app.errorMiddleware)
		.to(ErrorMiddleware)
		.inSingletonScope();
	bind<SessionMiddleware>(WEB.app.sessionMiddleware)
		.to(SessionMiddleware)
		.inSingletonScope();
	bind<ServerWeb>(WEB.app.ServerWeb).to(ServerWeb).inSingletonScope();
	bind<KafkaLoader>(WEB.app.KafkaLoader).to(KafkaLoader).inSingletonScope();
});
