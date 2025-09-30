import dotenv from 'dotenv';
dotenv.config();
import { ServerExpress } from './config/server';
import { webContainer } from './container/container.di';
import { WEB_TYPES } from './container/TYPES.di';
import { KafkaWebServer } from './config/kafka.webserver';

(async () => {
	const kafkaWebServer = webContainer.get<KafkaWebServer>(
		WEB_TYPES.app.KafkaWebServer,
	);

	await kafkaWebServer.startProducer();

	await kafkaWebServer.startConsumer();

	const server = webContainer.get<ServerExpress>(WEB_TYPES.app.ServerExpress);
	server.start();
})();
