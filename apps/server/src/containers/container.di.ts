import { Container } from "inversify";
import { serviceBindings } from "./services.di";
import { registrationBindings } from "./modules/registration.di";
import { authBindings } from "./modules/auth.di";
import { appBindings } from "./app.di";
import { oauthBindings } from "./oauth.di";

export const container = new Container();
container.load(serviceBindings);
container.load(oauthBindings);
container.load(registrationBindings);
container.load(authBindings);
container.load(appBindings);
