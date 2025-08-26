import { Router } from "express";
import { container, injectable } from "tsyringe";
import { controllersClasses } from "../../registrator";

@injectable()
export class ServerRoutes {
	router: Router;

	constructor() {
		this.router = Router();

		controllersClasses.forEach(controller => {
			this.router.use(container.resolve(controller).router);
		});
	}
}
