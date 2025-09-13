import { container } from '../../../containers/container.di';
import { TYPES } from '../../../containers/TYPES';
import { randomEmail } from '../../__e2e__/generateString';
import { SERVER_PREFIX } from '../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { RegistrationDTO } from '../../../common/models/schemas/registration.dto';
import { DatabaseService } from '../../../common/services/postgres/database.service';
import { testServer } from '../../__e2e__/supertest';

const profile = { name: 'test', about: 'null', country_code: 'RU' };
describe('[REGISTRATION] E2E SUPERTEST', () => {
	const email = randomEmail();
	const databaseService = container.get<DatabaseService>(
		TYPES.services.database,
	);

	it('test', async () => {
		await testServer.get(SERVER_PREFIX + serverPaths.init).expect(204);
	});

	it('Email method', async () => {
		await testServer
			.post(SERVER_PREFIX + serverPaths.registration)
			.field(
				'data',
				JSON.stringify({
					user: { email, password: '123123' },
					profile,
				} satisfies RegistrationDTO),
			)
			.expect(201)
			.then(res => {
				console.log('BODY', res.body);
				expect(res.ok).toBe(true);
			});
	});

	// TODO: Починить этот тест
	it('Not working provider method', async () => {
		await testServer
			.post(SERVER_PREFIX + serverPaths.registration)
			.field(
				'data',
				JSON.stringify({
					user: { email: null, password: null },
					profile,
				} satisfies RegistrationDTO),
			)
			.expect(400);
	});

	afterAll(async () => {
		await databaseService.db
			.deleteFrom('users')
			.where(eb => eb('email', '=', email))
			.returningAll()
			.execute();
	});
});
