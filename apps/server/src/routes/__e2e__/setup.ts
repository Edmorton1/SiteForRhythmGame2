import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
import dotenv from 'dotenv';
dotenv.config({ path: envPath });
import { container } from '../../containers/container.di';
import { ServerExpress } from '../../config/server';
import { TYPES } from '../../containers/TYPES';

export const testSetupServer = container.get<ServerExpress>(
	TYPES.app.ServerExpress,
);

beforeAll(() => {
	testSetupServer.start();
});

afterAll(async () => {
	await testSetupServer.close();
});
