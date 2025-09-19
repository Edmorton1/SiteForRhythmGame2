import { ContainerModule } from 'inversify';
import { WEB_TYPES } from './TYPES.di';
import { TestController } from '../controllers/test.controller';

export const controllersBindings = new ContainerModule(({ bind }) => {
	bind<TestController>(WEB_TYPES.controllers)
		.to(TestController)
		.inSingletonScope();
});
