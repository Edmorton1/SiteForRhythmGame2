import { Module } from "@nestjs/common";
import { LoggerModule } from "nestjs-pino";
import { AuthModule } from "@apps/server/auth/auth.module";
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
		AuthModule,
	],
})
export class AppModule {}
