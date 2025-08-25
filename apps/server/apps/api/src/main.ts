import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
// import fs from "fs";
import { AppModule } from "./app/app.module";
import { SERVER_PREFIX } from "../../../../../libs/shared/CONST";
import { getEnv } from "../../../libs/func/env";
// import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
//prettier-ignore
import { OpenApiGeneratorV3 } from "@asteasolutions/zod-to-openapi";
import swaggerUi from "swagger-ui-express";
import "./auth/docs/auth.docs";
import { registry } from "./app/registry";

void (async () => {
	const app = await NestFactory.create(AppModule, {
		bufferLogs: true,
	});

	app.setGlobalPrefix(SERVER_PREFIX);

	const generator = new OpenApiGeneratorV3(registry.definitions);

	const document = generator.generateDocument({
		openapi: "3.0.0",
		info: {
			title: "Rhythm Game",
			description: "Rhythm Game web API",
			version: "1.0",
		},
	});

	app.use("/docs", swaggerUi.serve, swaggerUi.setup(document));

	const server = await app.listen(getEnv("PORT"), getEnv("HOST"));

	console.log("SUPER SERVER", server.address());
})();
