import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { AUTH } from "../SERVICE_NAMES";
import { getEnv } from "../../../../libs/func/env";

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
})
export class AuthModule {}
