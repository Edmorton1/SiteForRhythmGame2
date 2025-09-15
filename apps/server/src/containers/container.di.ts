import { Container } from 'inversify';
import { serviceBindings } from './services.di';
import { appBindings } from './app.di';

export const rootContainer = new Container();
rootContainer.load(serviceBindings);
rootContainer.load(appBindings);
