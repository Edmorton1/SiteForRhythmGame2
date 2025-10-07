import dotenv from 'dotenv';
dotenv.config();
import { webContainer } from '../../container/container.di';
import { KafkaWebServer } from '../kafka.webserver';
import { WEB_TYPES } from '../../container/TYPES.di';
import { ServerExpress } from './server';

export const startServer = async () => {
	const kafkaWebServer = webContainer.get<KafkaWebServer>(
		WEB_TYPES.app.KafkaWebServer,
	);

	await kafkaWebServer.startKafka();

	const server = webContainer.get<ServerExpress>(WEB_TYPES.app.ServerExpress);
	server.start();
};
