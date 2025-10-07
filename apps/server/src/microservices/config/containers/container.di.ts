import { Container } from 'inversify';
import { appMicroBindings } from './app.di';
import { adaptersBindings } from '../../../common/adapters/container/adapters.di';
import { microservicesBindings } from '../../common/container/adapters-micro.di';

export const rootMicroContainer = new Container();
rootMicroContainer.load(adaptersBindings);
rootMicroContainer.load(microservicesBindings);
rootMicroContainer.load(appMicroBindings);
