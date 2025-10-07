import dotenv from 'dotenv';
dotenv.config();
import { webContainer } from '../../container/container.di';
import { KafkaLoader } from '../kafka/kafka.loader';
import { WEB } from '../../container/web.di';
import { ServerWeb } from './server';

export const startServer = async () => {
	const kafkaWebServer = webContainer.get<KafkaLoader>(WEB.app.KafkaLoader);

	await kafkaWebServer.startKafka();

	const server = webContainer.get<ServerWeb>(WEB.app.ServerWeb);
	server.start();
};
