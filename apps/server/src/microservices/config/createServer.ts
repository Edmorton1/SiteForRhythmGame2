import dotenv from 'dotenv';
dotenv.config();
import { Container } from 'inversify';
// prettier-ignore
import { KafkaMicroservice, KafkaMicroserviceOptions } from './kafka.microservice';
import { MICRO_TYPES } from './containers/TYPES.di';

export const createMicroServer = (
	container: Container,
	options: KafkaMicroserviceOptions,
) => {
	container.get<KafkaMicroservice>(MICRO_TYPES.app.server).start(options);
};
