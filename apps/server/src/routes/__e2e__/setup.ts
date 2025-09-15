import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
import dotenv from 'dotenv';
dotenv.config({ path: envPath });
import { container } from '../../containers/container.di';
import { ServerExpress } from '../../config/server';
import { COMMON_TYPES } from '../../containers/TYPES.di';

export const testSetupServer = container.get<ServerExpress>(
	COMMON_TYPES.app.ServerExpress,
);

beforeAll(() => {
	testSetupServer.start();
});

afterAll(async () => {
	await testSetupServer.close();
});
