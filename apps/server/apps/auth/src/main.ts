import dotenv from "dotenv";
dotenv.config();
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fs from "fs";
import { patchNestJsSwagger, ZodValidationPipe } from "nestjs-zod";
import { AuthModule } from "./auth.module";
import { getEnv } from "@server/libs/common/env";
patchNestJsSwagger();

void (async () => {
	const app = await NestFactory.create(AuthModule, {
		bufferLogs: true,
	});

	app.useGlobalPipes(new ZodValidationPipe());
	const options = new DocumentBuilder()
		.setTitle("Cats example")
		.setDescription("The cats API description")
		.setVersion("1.0")
		.addTag("cats")
		.build();

	const document = SwaggerModule.createDocument(app, options);
	// FIXME: Из-за этого WARN при запуске
	SwaggerModule.setup("api", app, document);

	fs.writeFileSync("./openapi.json", JSON.stringify(document));
	app.setGlobalPrefix("/api");

	const server = await app.listen(getEnv("PORT"), getEnv("HOST"));

	console.log("SUPER SERVER", server.address());
})();
