import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/server/db/postgres/database.module";
import { RedisModule } from "@apps/server/db/redis/redis.module";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "@apps/server/auth/auth.module";
import { getEnv } from "@apps/server/libs/utils/env";

@Module({
	imports: [
		AuthModule,
		LoggerModule.forRoot({
			pinoHttp: (() => {
				const options: any = { autoLogging: false };

				if (getEnv("NODE_ENV") === "development") {
					options.transport = {
						target: "pino-pretty",
						options: { colorize: true },
					};
				}

				return options;
			})(),
		}),
		DatabaseModule,
		RedisModule,
	],
})
export class AppModule {}
