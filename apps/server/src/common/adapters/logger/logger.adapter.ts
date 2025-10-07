import pino, { Logger } from 'pino';
import { ConfigAdapter } from '../config/config.adapter';
import { inject, injectable } from 'inversify';
import { ADAPTERS } from '../container/adapters.types';

@injectable()
export class LoggerAdapter {
	logger: Logger;

	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
	) {
		this.logger = pino(
			this.config.getEnv('NODE_ENV') === 'development'
				? { transport: { target: 'pino-pretty' } }
				: undefined,
		);
	}
}
