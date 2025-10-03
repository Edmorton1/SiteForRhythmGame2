import path from 'path';
const envPath = path.resolve(__dirname, '../../../.env');
import dotenv from 'dotenv';
dotenv.config({ path: envPath });
import { ServerExpress } from '../../../../web-server/config/server';
import { WEB_TYPES } from '../../../../web-server/container/TYPES.di';
import { authMicroContainer } from '../../../../microservices/services/auth/container/container.di';

export const testSetupServer = authMicroContainer.get<ServerExpress>(
	WEB_TYPES.app.ServerExpress,
);

beforeAll(() => {
	testSetupServer.start();
});

afterAll(async () => {
	await testSetupServer.close();
});
