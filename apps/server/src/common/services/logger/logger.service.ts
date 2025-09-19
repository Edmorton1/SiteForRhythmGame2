import pino, { Logger } from 'pino';
import { ConfigService } from '../config/config.service';
import { inject, injectable } from 'inversify';
import { WEB_TYPES } from '../../../web-server/container/TYPES.di';

@injectable()
export class LoggerService {
	logger: Logger;

	constructor(
		@inject(WEB_TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		this.logger = pino(
			this.configService.getEnv('NODE_ENV') === 'development'
				? { transport: { target: 'pino-pretty' } }
				: undefined,
		);

		const example = Math.random();
		console.log('_____________________________________ЭТОТ ЭКЗЕМПЛЯР', example);
	}
}
