import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
// prettier-ignore
import { KafkaLoadingOptions } from '../kafka/kafka.loader';
import { MICRO } from '../containers/micro.types';
import { ServerMicroservice } from './server';

export const startMicroServer = (
	container: Container,
	options: KafkaLoadingOptions,
) => {
	container.get<ServerMicroservice>(MICRO.app.server).start(options);
};
