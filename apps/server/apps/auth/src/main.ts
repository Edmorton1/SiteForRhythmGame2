import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth.module";
import { getEnv } from "@server/libs/func/env";

void (async () => {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AuthModule,
		{
			transport: Transport.TCP,
			options: {
				port: parseInt(getEnv("AUTH_PORT")),
				host: getEnv("AUTH_HOST"),
			},
		},
	);
	await app.listen();
})();
