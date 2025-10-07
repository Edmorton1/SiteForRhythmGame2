import { ContainerModule } from 'inversify';
import { KafkaSender } from '../adapters/kafka.sender';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';

export const webAdaptersBindings = new ContainerModule(({ bind }) => {
	bind<KafkaSender>(ADAPTERS.web.kafkaSender)
		.to(KafkaSender)
		.inSingletonScope();
});
