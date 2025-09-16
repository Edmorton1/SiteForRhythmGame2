import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { GATEWAY_TYPES } from './containers/TYPES.di';
import { ServerExpress } from '../config/server.express';
import { gatewayContainer } from './containers/container.di';

(() => {
	console.log(GATEWAY_TYPES.app.ServerExpress);
	const server = gatewayContainer.get<ServerExpress>(
		GATEWAY_TYPES.app.ServerExpress,
	);

	server.start();
})();
