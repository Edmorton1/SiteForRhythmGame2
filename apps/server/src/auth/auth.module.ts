import { Module } from "@nestjs/common";
import { DatabaseModule } from "@server/services/db/postgres/database.module";
import { AuthService } from "@apps/server/auth/auth.service";
import { AuthController } from "@apps/server/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { getEnv } from "@server/libs/common/env";

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
