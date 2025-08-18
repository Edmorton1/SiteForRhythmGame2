import { Module } from "@nestjs/common";
import { DatabaseModule } from "@apps/server/db/postgres/database.module";
import { AuthService } from "@apps/server/auth/auth.service";
import { AuthController } from "@apps/server/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { RedisModule } from "@apps/server/db/redis/redis.module";
import { getEnv } from "@apps/server/libs/utils/env";

@Module({
	imports: [
		RedisModule,
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
