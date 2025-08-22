import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
// import fs from "fs";
import { AppModule } from "./app.module";
import { SERVER_PREFIX } from "../../../../../libs/shared/CONST";
import { getEnv } from "../../../libs/func/env";

void (async () => {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	app.setGlobalPrefix(SERVER_PREFIX);

	const server = await app.listen(getEnv("PORT"), getEnv("HOST"));

	console.log("SUPER SERVER", server.address());
})();
