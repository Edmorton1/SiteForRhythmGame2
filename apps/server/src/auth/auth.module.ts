import { Module } from "@nestjs/common";
import DatabaseModule from "@apps/server/db/postgres/database.module";
import { AuthService } from "@apps/server/auth/auth.service";
import { AuthController } from "@apps/server/auth/auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RedisModule } from "@apps/server/db/redis/redis.module";

@Module({
	imports: [
		RedisModule,
		DatabaseModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.getOrThrow("JWT_SECRET"),
				signOptions: {
					expiresIn: "24h",
				},
			}),
		}),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
