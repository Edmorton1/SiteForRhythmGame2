import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
// prettier-ignore
import { KafkaMicroserviceOptions } from './kafka.microservice';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ServerMicroservice } from './server';

export const createMicroServer = (
	container: Container,
	options: KafkaMicroserviceOptions,
) => {
	container.get<ServerMicroservice>(MICRO_TYPES.app.server).start(options);
};
