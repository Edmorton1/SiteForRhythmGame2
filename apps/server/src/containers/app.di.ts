import { ContainerModule } from "inversify";
import { TYPES } from "./TYPES";
import { ServerRoutes } from "../config/server/server.routes";
import { ExpressError } from "../config/middlewares/express.error";
import { ServerExpress } from "../config/server/server";
import { ExpressSession } from "../config/middlewares/express.session";

export const appBindings = new ContainerModule(({ bind }) => {
	bind<ServerRoutes>(TYPES.app.ServerRoutes)
		.to(ServerRoutes)
		.inSingletonScope();
	bind<ExpressError>(TYPES.app.ExpressError)
		.to(ExpressError)
		.inSingletonScope();
	bind<ExpressSession>(TYPES.app.ExpressSession)
		.to(ExpressSession)
		.inSingletonScope();
	bind<ServerExpress>(TYPES.app.ServerExpress)
		.to(ServerExpress)
		.inSingletonScope();
});
