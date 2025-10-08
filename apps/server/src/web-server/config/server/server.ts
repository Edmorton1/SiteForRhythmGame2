import express, { Express, json } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ControllerCollector } from '../controllers/controller.collector';
import { SERVER_PREFIX } from '../../../../../../libs/common/CONST';
import { ConfigAdapter } from '../../../common/adapters/config/config.adapter';
import { LoggerAdapter } from '../../../common/adapters/logger/logger.adapter';
import swaggerUi from 'swagger-ui-express';
import { openapiDocs } from '../swagger/openapi.config';
import { inject, injectable } from 'inversify';
import { WEB } from '../../container/web.di';
import passport from 'passport';
import { Server } from 'http';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';
import { RedisAdapter } from '../../../common/adapters/redis/redis.adapter';
import { SessionMiddleware } from '../middlewares/session.middleware';
import { ErrorMiddleware } from '../middlewares/error.middleware';

@injectable()
export class ServerWeb {
	app: Express;
	server?: Server;

	constructor(
		@inject(WEB.app.ControllerCollector)
		private readonly collector: ControllerCollector,
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
		@inject(WEB.app.errorMiddleware)
		private readonly errorsMiddleware: ErrorMiddleware,
		@inject(ADAPTERS.common.logger)
		private readonly logger: LoggerAdapter,
		@inject(WEB.app.sessionMiddleware)
		private readonly sessionMiddleware: SessionMiddleware,
		@inject(ADAPTERS.common.redis)
		private readonly redis: RedisAdapter,
	) {
		this.app = express();
	}

	private applyMiddlewares = (): this => {
		this.app.use(cookieParser());
		this.app.use(helmet());
		this.app.use(json());
		this.app.use(this.sessionMiddleware.expressSession);
		this.app.use(passport.initialize());
		this.app.use(passport.session());
		// РОУТЕР ЗАГРУЖАЕТСЯ
		this.app.use(SERVER_PREFIX, this.collector.router);

		return this;
	};

	private configureApp = () => {
		this.applyMiddlewares();
		this.app.use(this.errorsMiddleware.expressError);
		this.app.use(
			SERVER_PREFIX + '/docs',
			swaggerUi.serve,
			swaggerUi.setup(openapiDocs),
		);
	};

	start = () => {
		this.configureApp();
		const port = parseInt(this.config.getEnv('PORT'));
		// const port = (Math.random() * 10) % 10 > 5 ? 3000 : 3001;
		const host = this.config.getEnv('HOST');

		this.server = this.app.listen(port, host);
		this.logger.logger.info(
			`SERVER STARTED ON PORT = ${port} AND HOST = ${host}`,
		);
	};

	// TODO: Убрать базы данных из Web-Server
	close = async () => {
		if (!this.server) {
			console.log('SERVER NOT STARTED');
		} else {
			// await this.database.disconnect();
			await this.redis.disconnect();
			this.logger.logger.flush();
			this.server.close();
		}
	};
}
