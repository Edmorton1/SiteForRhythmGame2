import { Module } from "@nestjs/common";
import { AuthMicroserviceService } from "./auth_microservice.service";
import { AuthMicroserviceController } from "./auth_microservice.controller";

@Module({
	controllers: [AuthMicroserviceController],
	providers: [AuthMicroserviceService],
})
export class AuthMicroserviceModule {}
