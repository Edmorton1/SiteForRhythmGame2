import { Router } from "express";
import { container, injectable } from "tsyringe";
import { RegistrationController } from "../../routes/registration/controller/registration.controller";

@injectable()
export class ServerRoutes {
	router: Router;

	constructor() {
		this.router = Router();

		const controllersClasses = [RegistrationController];

		controllersClasses.forEach(controller => {
			this.router.use(container.resolve(controller).router);
		});
	}
}
