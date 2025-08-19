import { Module } from "@nestjs/common";
import { ApiController } from "./api.controller";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { clientName } from "apps/api/src/_CONST";

@Module({
	imports: [
		ClientsModule.register([
			{
				name: clientName,
				transport: Transport.TCP,
				// TODO: hardCode
				options: { port: 3001 },
			},
		]),
	],
	controllers: [ApiController],
})
export class ApiModule {}
