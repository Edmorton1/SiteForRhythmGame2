import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import DatabaseModule from "@apps/server/db/postgres/database.module";
import { AuthModule } from "@apps/server/auth/auth.module";
import { RedisModule } from "@apps/server/db/redis/redis.module";
import { LoggerModule } from "nestjs-pino";

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		LoggerModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				const pinoHttpOption: any = {
					autoLogging: false,
				};

				if (configService.get("NODE_ENV") !== "production") {
					pinoHttpOption.transport = {
						target: "pino-pretty",
						options: { colorize: true },
					};
				}
				return { pinoHttp: pinoHttpOption };
			},
		}),
		AuthModule,
		DatabaseModule,
		RedisModule,
	],
})
export class AppModule {}
