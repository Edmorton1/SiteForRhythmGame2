import { ContainerModule } from "inversify";
import { TYPES } from "../TYPES";
import { AuthController } from "../../routes/auth/controller/auth.controller";
import { AuthService } from "../../routes/auth/auth.service";
import { AuthRepository } from "../../routes/auth/auth.repository";

export const authBindings = new ContainerModule(({ bind }) => {
	bind<AuthController>(TYPES.modules.auth.controller)
		.to(AuthController)
		.inSingletonScope();
	bind<AuthService>(TYPES.modules.auth.service)
		.to(AuthService)
		.inSingletonScope();
	bind<AuthRepository>(TYPES.modules.auth.repository)
		.to(AuthRepository)
		.inSingletonScope();
});
