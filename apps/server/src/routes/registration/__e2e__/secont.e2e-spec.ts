import { SERVER_PREFIX } from '../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { testServer } from '../../__e2e__/supertest';

describe('Second', () => {
	it('Second2', async () => {
		await testServer.get(SERVER_PREFIX + serverPaths.init).expect(204);
	});
});
