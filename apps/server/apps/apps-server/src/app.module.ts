import { Module } from "@nestjs/common";
// import { DatabaseModule } from "@apps/server/db/postgres/database.module";
// import { RedisModule } from "@apps/server/db/redis/redis.module";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "@apps/server/auth_old/auth.module";
import { AuthMicroserviceModule } from "@apps/server/auth_microservice/auth_microservice.module";
import { getEnv } from "@server/libs/common/env";

@Module({
	imports: [
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
		// DatabaseModule,
		// RedisModule,
		AuthModule,
		AuthMicroserviceModule,
	],
})
export class AppModule {}
