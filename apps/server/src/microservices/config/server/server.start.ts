import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
// prettier-ignore
import { KafkaLoadingOptions } from '../kafka/kafka.loader';
import { MICRO_TYPES } from '../containers/TYPES.di';
import { ServerMicroservice } from './server';

export const startMicroServer = (
	container: Container,
	options: KafkaLoadingOptions,
) => {
	container.get<ServerMicroservice>(MICRO_TYPES.app.server).start(options);
};
