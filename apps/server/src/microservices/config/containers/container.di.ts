import { Container } from 'inversify';
import { appMicroBindings } from './app.di';
import { serviceBindings } from '../../../common/containers/services.di';

export const rootMicroContainer = new Container();
rootMicroContainer.load(serviceBindings);
rootMicroContainer.load(appMicroBindings);
