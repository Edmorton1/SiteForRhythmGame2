import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { authContainer } from './containers/container.di';
import { ServerExpress } from '../../config/server.express';
import { AUTH_TYPES } from './containers/TYPES.di';

(() => {
	const server = authContainer.get<ServerExpress>(AUTH_TYPES.app.ServerExpress);

	server.start();
})();
