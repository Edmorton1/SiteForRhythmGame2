import express, { Express, json } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { inject, injectable } from "tsyringe";
import { ServerRoutes } from "./server.routes";
import { SERVER_PREFIX } from "../../../../../libs/shared/CONST";
import { ConfigService } from "../../common/services/config/config.service";
import { ExpressError } from "../middlewares/express.error";
import { LoggerService } from "../../common/services/logger/logger.service";
import swaggerUi from "swagger-ui-express";
import { openapiDocs } from "./swagger/openapi.config";

@injectable()
export class ServerExpress {
	app: Express;

	constructor(
		@inject(ServerRoutes)
		private readonly serverRoutes: ServerRoutes,
		private readonly configService: ConfigService,
		private readonly expressError: ExpressError,
		private readonly loggerService: LoggerService,
	) {
		this.app = express();
	}

	private applyMiddlewares = (): this => {
		this.app.use(cookieParser());
		this.app.use(helmet());
		this.app.use(json());

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
			SERVER_PREFIX + "/docs",
			swaggerUi.serve,
			swaggerUi.setup(openapiDocs),
		);
	};

	init = async () => {
		this.configureApp();
		const port = parseInt(this.configService.getEnv("PORT"));
		const host = this.configService.getEnv("HOST");

		this.app.listen(port, host);
		this.loggerService.logger.info(
			`SERVER STARTED ON PORT = ${port} AND HOST = ${host}`,
		);
	};
}
