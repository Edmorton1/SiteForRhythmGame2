import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { container } from './containers/container.di';
import { TYPES } from './containers/TYPES';
import { ServerExpress } from './config/server';
import './_declarations/session';

(async () => {
	const app = container.get<ServerExpress>(TYPES.app.ServerExpress);

	await app.init();
})();
