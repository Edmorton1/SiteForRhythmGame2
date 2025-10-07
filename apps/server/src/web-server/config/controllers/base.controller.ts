import { NextFunction, Request, Response, Router } from 'express';

interface IControllerRoute {
	path: string;
	handle: (req: Request, res: Response) => Promise<void> | void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: ((req: Request, res: Response, next: NextFunction) => any)[];
}

export class BaseController {
	readonly router: Router;
	constructor() {
		this.router = Router();
	}

	protected bindRoutes = (routes: IControllerRoute[]): void => {
		for (const route of routes) {
			if (!route.middlewares?.length) route.middlewares = [];

			const pipeline = [...route.middlewares, route.handle];

			this.router[route.method](route.path, ...pipeline);
		}
	};
}
