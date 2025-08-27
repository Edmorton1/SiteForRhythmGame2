import pino, { Logger } from "pino";
import { ConfigService } from "../config/config.service";
import { injectable } from "tsyringe";

@injectable()
export class LoggerService {
	logger: Logger;

	constructor(private readonly configService: ConfigService) {
		this.logger = pino(
			this.configService.getEnv("NODE_ENV") === "development"
				? { transport: { target: "pino-pretty" } }
				: undefined,
		);

		const example = Math.random();
		console.log("_____________________________________ЭТОТ ЭКЗЕМПЛЯР", example);
	}
}
