import { Module } from "@nestjs/common";
import { AuthController } from "../controllers/auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH } from "../../app/SERVICE_NAMES";
import { getEnv } from "../../../../../libs/func/env";
import { AuthService } from "../services/auth.service";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: AUTH,
				transport: Transport.TCP,
				options: { port: parseInt(getEnv("AUTH_PORT")) },
			},
		]),
	],
	controllers: [AuthController],
	providers: [AuthService],
})
export class AuthModule {}
