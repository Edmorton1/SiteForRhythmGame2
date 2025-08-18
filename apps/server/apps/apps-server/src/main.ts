import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AuthModule } from "@apps/server/auth_old/auth.module";
import { getEnv } from "@server/libs/common/env";

void (async () => {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AuthModule,
		{
			transport: Transport.TCP,
			options: {
				port: parseInt(getEnv("PORT")),
				host: getEnv("HOST"),
			},
		},
	);

	await app.listen();
})();
