import { inject, injectable } from 'inversify';
import session from 'express-session';
import { ConfigService } from '../../../common/services/config/config.service';
import { RedisService } from '../../../common/services/redis/redis.service';
import { SERVICES_TYPES } from '../../../common/containers/SERVICES_TYPES.di';

@injectable()
export class ExpressSession {
	constructor(
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
		@inject(SERVICES_TYPES.redis)
		private readonly redisService: RedisService,
	) {}
	expressSession = session({
		name: this.configService.getEnv('COOKIE_NAME'),
		secret: this.configService.getEnv('SESSION_SECRET'),
		store: this.redisService.store,
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
