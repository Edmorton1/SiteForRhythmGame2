import { ContainerModule } from "inversify";
import { TYPES } from "./TYPES";
import { Passport } from "../routes/_google/passport";

export const oauthBindings = new ContainerModule(({ bind }) => {
	bind<Passport>(TYPES.oauth.Google).to(Passport).inSingletonScope();
});
