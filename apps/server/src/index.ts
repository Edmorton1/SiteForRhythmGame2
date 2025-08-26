import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { container } from "tsyringe";
import { ServerExpress } from "./config/server/server";

(async () => {
	const app = container.resolve(ServerExpress);

	await app.init();
})();
