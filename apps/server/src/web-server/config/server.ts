import express, { Express, json } from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ServerRoutes } from './server.routes';
import { SERVER_PREFIX } from '../../../../../libs/shared/CONST';
import { ConfigService } from '../../common/services/config/config.service';
import { ExpressError } from './middlewares/express.error';
import { LoggerService } from '../../common/services/logger/logger.service';
import swaggerUi from 'swagger-ui-express';
import { openapiDocs } from './swagger/openapi.config';
import { inject, injectable } from 'inversify';
import { COMMON_TYPES } from '../container/TYPES.di';
import { ExpressSession } from './middlewares/express.session';
import passport from 'passport';
import { Server } from 'http';
import { DatabaseService } from '../../common/services/postgres/database.service';
import { RedisService } from '../../common/services/redis/redis.service';

@injectable()
export class ServerExpress {
	app: Express;
	server: Server | undefined;

	constructor(
		@inject(COMMON_TYPES.app.ServerRoutes)
		private readonly serverRoutes: ServerRoutes,
		@inject(COMMON_TYPES.services.config)
		private readonly configService: ConfigService,
		@inject(COMMON_TYPES.app.ExpressError)
		private readonly expressError: ExpressError,
		@inject(COMMON_TYPES.services.logger)
		private readonly loggerService: LoggerService,
		@inject(COMMON_TYPES.app.ExpressSession)
		private readonly expressSession: ExpressSession,
		@inject(COMMON_TYPES.services.database)
		private readonly database: DatabaseService,
		@inject(COMMON_TYPES.services.redis)
		private readonly redis: RedisService,
	) {
		this.app = express();
	}

	private applyMiddlewares = (): this => {
		this.app.use(cookieParser());
		this.app.use(helmet());
		this.app.use(json());
		this.app.use(this.expressSession.expressSession);
		this.app.use(passport.initialize());
		this.app.use(passport.session());

		return this;
	};

	private useRoutes = () => {
		this.app.use(SERVER_PREFIX, this.serverRoutes.router);

		return this;
	};

	private configureApp = () => {
		this.applyMiddlewares().useRoutes();
		this.app.use(this.expressError.expressError);
		this.app.use(
			SERVER_PREFIX + '/docs',
			swaggerUi.serve,
			swaggerUi.setup(openapiDocs),
		);
	};

	start = () => {
		this.configureApp();
		const port = parseInt(this.configService.getEnv('PORT'));
		// const port = (Math.random() * 10) % 10 > 5 ? 3000 : 3001;
		const host = this.configService.getEnv('HOST');

		this.server = this.app.listen(port, host);
		this.loggerService.logger.info(
			`SERVER STARTED ON PORT = ${port} AND HOST = ${host}`,
		);
	};

	close = async () => {
		if (!this.server) {
			console.log('SERVER NOT STARTED');
		} else {
			await this.database.disconnect();
			await this.redis.disconnect();
			this.loggerService.logger.flush();
			this.server.close();
		}
	};
}
