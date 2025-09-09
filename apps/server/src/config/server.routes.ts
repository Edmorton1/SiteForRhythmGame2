import { Router } from "express";
import { TYPES } from "../containers/TYPES";
import { container } from "../containers/container.di";
import { BaseController } from "./base.controller";

export class ServerRoutes {
	router: Router;

	constructor() {
		this.router = Router();

		const controllers: BaseController[] = Object.values(TYPES.modules).map(e =>
			container.get(e.controller),
		);

		controllers.forEach(controller => {
			this.router.use(controller.router);
		});
	}
}
