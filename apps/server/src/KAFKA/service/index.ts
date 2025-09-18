import dotenv from 'dotenv';
dotenv.config();
import { microserviceContainer } from './containers/container.di';
import { ServerMicroservice } from './server.microservice';
import { MICRO_TYPES } from './TYPES.di';

(() => {
	const server = microserviceContainer.get<ServerMicroservice>(
		MICRO_TYPES.microApp.server,
	);
	server.start();
})();
