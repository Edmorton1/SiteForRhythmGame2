import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { LoggerModule } from "nestjs-pino";
import { JwtModule } from "@nestjs/jwt";
import { getEnv } from "../../../libs/func/env";
import { DatabaseModule } from "../../../services/db/postgres/database.module";

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
