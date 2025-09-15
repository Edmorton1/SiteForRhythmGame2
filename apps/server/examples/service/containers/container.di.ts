import { Container } from 'inversify';
import { serviceBindings } from '../../../containers/services.di';
import { appBindings } from '../../../containers/app.di';
import { MODULE, Module } from '../../../containers/modules.di';
import { MODULE_TYPES } from './TYPES.di';

export const moduleContainer = new Container();
moduleContainer.bind<Module>(MODULE).toConstantValue(MODULE_TYPES.modules);
moduleContainer.load(serviceBindings);

moduleContainer.load(appBindings);
