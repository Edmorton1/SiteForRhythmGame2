import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
import { MICRO_TYPES } from './containers/TYPES.di';
import { ServerMicroservice } from './server.microservice';

export const createMicroServer = (
	container: Container,
	TYPES: typeof MICRO_TYPES,
) => {
	container.get<ServerMicroservice>(TYPES.app.server).start();
};
