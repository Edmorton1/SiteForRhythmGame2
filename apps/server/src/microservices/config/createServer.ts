import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
import { ServerMicroservice } from './server.microservice';
import { MICRO_TYPES } from './containers/TYPES.di';

export const createMicroServer = (container: Container) => {
	container.get<ServerMicroservice>(MICRO_TYPES.app.server).start();
};
