import { Container } from 'inversify';
import { microAppBindings } from './app.di';
import { serviceBindings } from '../../../containers/services.di';
import { microserviceBindings } from './microservices.di';

export const microserviceContainer = new Container();
microserviceContainer.load(serviceBindings);
microserviceContainer.load(microserviceBindings);
microserviceContainer.load(microAppBindings);
