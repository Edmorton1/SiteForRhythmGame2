import { Container } from 'inversify';
import { serviceBindings } from './services.di';
import { appBindings } from './app.di';

// TODO: СДЕЛАТЬ ФАБРИКУ СЕРВЕРА
// КОТОРАЯ БУДЕТ ПРИНИМАТЬ container И modules
// ВМЕСТО ИХ СОЗДАНИЯ В КОНТЕЙНЕР

export const rootContainer = new Container();
rootContainer.load(serviceBindings);
rootContainer.load(appBindings);
