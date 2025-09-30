import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
import { KafkaMicroservice } from './kafka.microservice';
import { MICRO_TYPES } from './containers/TYPES.di';

export const createMicroServer = (container: Container) => {
	container.get<KafkaMicroservice>(MICRO_TYPES.app.server).start();
};
