import { ContainerModule } from 'inversify';
import { KafkaMessenger } from '../packages/kafka/kafka.messenger';
import { WEB_SERVICES_TYPES } from './SERVICES_TYPES.di';

export const webServicesBindings = new ContainerModule(({ bind }) => {
	bind<KafkaMessenger>(WEB_SERVICES_TYPES.kafkaMessenger)
		.to(KafkaMessenger)
		.inSingletonScope();
});
