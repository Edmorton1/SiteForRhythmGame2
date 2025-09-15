import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { container } from './containers/container.di';
import { COMMON_TYPES } from './containers/TYPES.di';
import { ServerExpress } from './config/server';
import './_declarations/session';

(() => {
	const server = container.get<ServerExpress>(COMMON_TYPES.app.ServerExpress);

	server.start();
})();
