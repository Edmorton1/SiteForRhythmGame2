import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { type MicroserviceOptions, Transport } from "@nestjs/microservices";
import { AuthModule } from "./auth.module";

void (async () => {
	const app = await NestFactory.createMicroservice<MicroserviceOptions>(
		AuthModule,
		{
			transport: Transport.TCP,
			options: {
				// TODO: hardCode
				port: 3001,
			},
		},
	);
	await app.listen();
})();
