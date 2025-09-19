import dotenv from 'dotenv';
dotenv.config();
import { ServerExpress } from './config/server';
import { webContainer } from './container/container.di';
import { WEB_TYPES } from './container/TYPES.di';
import { KafkaController } from '../common/services/kafka/kafka.controller';

(async () => {
	const kafkaController = webContainer.get<KafkaController>(
		WEB_TYPES.services.kafkaController,
	);

	await kafkaController.startProducer();

	await kafkaController.startConsumer();

	const server = webContainer.get<ServerExpress>(WEB_TYPES.app.ServerExpress);
	server.start();
})();
