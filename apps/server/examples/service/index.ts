import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { ServerExpress } from '../../config/server';
import { MODULE_TYPES } from './containers/TYPES.di';
import { moduleContainer } from './containers/container.di';

(() => {
	const server = moduleContainer.get<ServerExpress>(
		MODULE_TYPES.app.ServerExpress,
	);

	server.start();
})();
