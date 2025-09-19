import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { ServerExpress } from '../../web-server/config/server';
import { TRACKS_TYPES } from './containers/TYPES.di';
import { tracksContainer } from './containers/container.di';

(() => {
	console.log('TRACKS', TRACKS_TYPES.modules.tracks.service);
	const server = tracksContainer.get<ServerExpress>(
		TRACKS_TYPES.app.ServerExpress,
	);
	// const server = new ServerExpress()

	server.start();
})();
