import { Container } from 'inversify';
import { rootContainer } from './container.di';
import { CONTAINER, MODULE, Module } from './modules.di';

// TODO: Удалить этот файл
export const createContainer = (modules: Module) => {
	const container = new Container({ parent: rootContainer });
	container.bind<Module>(MODULE).toConstantValue(modules);
	container.bind<Container>(CONTAINER).toConstantValue(container);
	return container;
};
