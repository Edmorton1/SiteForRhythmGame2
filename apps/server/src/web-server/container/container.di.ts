import { Container } from 'inversify';
import { serviceBindings } from '../../common/containers/services.di';
import { appBindings } from './app.di';
import { controllersBindings } from './controllers';

export const webContainer = new Container();
webContainer.load(serviceBindings);
webContainer.load(appBindings);
webContainer.load(controllersBindings);
