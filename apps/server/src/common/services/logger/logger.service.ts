import pino, { Logger } from 'pino';
import { ConfigService } from '../config/config.service';
import { inject, injectable } from 'inversify';
import { SERVICES_TYPES } from '../../containers/SERVICES_TYPES.di';

@injectable()
export class LoggerService {
	logger: Logger;

	constructor(
		@inject(SERVICES_TYPES.config)
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
