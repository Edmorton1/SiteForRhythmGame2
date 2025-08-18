import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import fs from "fs";
import { ConfigService } from "@nestjs/config";
import { patchNestJsSwagger, ZodValidationPipe } from "nestjs-zod";
patchNestJsSwagger();

void (async () => {
	const app = await NestFactory.create(AppModule, { bufferLogs: true });

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

	const configService = app.get(ConfigService);

	const server = await app.listen(
		configService.getOrThrow("PORT"),
		configService.getOrThrow("HOST"),
	);
	console.log("SUPER SERVER", server.address());
})();
