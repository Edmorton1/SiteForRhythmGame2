import { Module } from "@nestjs/common";
import { AuthService } from "@apps/server/auth_old/auth.service";
import { AuthController } from "@apps/server/auth_old/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { getEnv } from "@server/libs/common/env";
import { DatabaseModule } from "@server/services/db/postgres/database.module";

@Module({
	imports: [
		DatabaseModule,
		JwtModule.register({
			secret: getEnv("JWT_SECRET"),
			signOptions: {
				expiresIn: "24h",
			},
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
