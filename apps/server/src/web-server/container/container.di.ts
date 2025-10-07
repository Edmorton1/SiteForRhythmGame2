import { Container } from 'inversify';
import { appBindings } from './app.di';
import { controllersBindings } from './controllers';
import { webAdaptersBindings } from '../common/container/adapters-web.di';
import { adaptersBindings } from '../../common/adapters/container/adapters.di';

export const webContainer = new Container();
webContainer.load(adaptersBindings);
webContainer.load(webAdaptersBindings);
webContainer.load(appBindings);
webContainer.load(controllersBindings);
