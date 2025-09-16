import { Container } from 'inversify';
import { rootContainer } from './container.di';
import { CONTAINER, MODULE, Module } from './modules.di';

export const createContainer = (modules: Module) => {
	const container = new Container({ parent: rootContainer });
	container.bind<Module>(MODULE).toConstantValue(modules);
	container.bind<Container>(CONTAINER).toConstantValue(container);
	return container;
};

// ПОТОМ ПОЧИНИТЬ
type Controller = Record<string, symbol>;
export const createGatewayContainer = (controllers: Controller) => {
	const container = new Container({ parent: rootContainer });
	container.bind<Controller>(MODULE).toConstantValue(controllers);
	container.bind<Container>(CONTAINER).toConstantValue(container);
	return container;
};
