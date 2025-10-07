import { inject, injectable } from 'inversify';
import session from 'express-session';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';
import { ConfigAdapter } from '../../../common/adapters/config/config.adapter';
import { RedisAdapter } from '../../../common/adapters/redis/redis.adapter';

@injectable()
export class SessionMiddleware {
	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
		@inject(ADAPTERS.common.redis)
		private readonly redis: RedisAdapter,
	) {}
	expressSession = session({
		name: this.config.getEnv('COOKIE_NAME'),
		secret: this.config.getEnv('SESSION_SECRET'),
		store: this.redis.store,
		resave: false,
		saveUninitialized: false,
		cookie: {
			// TODO: В проде уменьшить
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
			// TODO: Сделать норм безопасность
			// secure: true,
			// sameSite: "strict",
		},
	});
}
