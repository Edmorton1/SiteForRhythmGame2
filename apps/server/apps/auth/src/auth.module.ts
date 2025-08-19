import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { DatabaseModule } from "@server/services/db/postgres/database.module";
import { LoggerModule } from "nestjs-pino";
import { getEnv } from "@server/libs/common/env";
import { JwtModule } from "@nestjs/jwt";

@Module({
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: getEnv("JWT_SECRET"),
			signOptions: {
				expiresIn: "24h",
			},
		}),
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
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
