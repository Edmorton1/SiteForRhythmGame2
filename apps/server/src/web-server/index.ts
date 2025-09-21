import dotenv from 'dotenv';
dotenv.config();
import { ServerExpress } from './config/server';
import { webContainer } from './container/container.di';
import { WEB_TYPES } from './container/TYPES.di';
import { KafkaController } from '../common/services/kafka/kafka.controller';
import { SERVICES_TYPES } from '../common/containers/SERVICES_TYPES.di';

(async () => {
	const kafkaController = webContainer.get<KafkaController>(
		SERVICES_TYPES.kafkaController,
	);

	await kafkaController.startProducer();

	await kafkaController.startConsumer();

	const server = webContainer.get<ServerExpress>(WEB_TYPES.app.ServerExpress);
	server.start();
})();
