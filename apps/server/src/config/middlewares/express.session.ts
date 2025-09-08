import { inject, injectable } from "inversify";
import { TYPES } from "../../containers/TYPES";
import { ConfigService } from "../../common/services/config/config.service";
import session from "express-session";
import { RedisService } from "../../common/services/redis/redis.service";

@injectable()
export class ExpressSession {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
		@inject(TYPES.services.redis)
		private readonly redisService: RedisService,
	) {}
	expressSession = session({
		secret: this.configService.getEnv("JWT_SECRET"),
		store: this.redisService.store,
		resave: false,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 60 * 24,
			httpOnly: true,
		},
	});
}
