import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
import dotenv from 'dotenv';
dotenv.config({ path: envPath });
import { ServerExpress } from '../../../../config/server';
import { COMMON_TYPES } from '../../../../containers/TYPES.di';
import { authContainer } from '../../containers/container.di';

export const testSetupServer = authContainer.get<ServerExpress>(
	COMMON_TYPES.app.ServerExpress,
);

beforeAll(() => {
	testSetupServer.start();
});

afterAll(async () => {
	await testSetupServer.close();
});
