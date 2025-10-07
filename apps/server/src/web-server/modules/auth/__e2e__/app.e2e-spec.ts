import { randomEmail } from '../../../../common/test_rename/generateString';
import { SERVER_PREFIX } from '../../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { RegistrationDTO } from '../../../../common/models/schemas/registration.dto';
import { DatabaseAdapter } from '../../../../microservices/common/adapters/postgres/database.adapters';
import { testServer } from './supertest';
import { LoginDTO } from '../../../../../../../libs/models/schemas/auth';
import { authContainer } from '../../../../microservices/services/auth/container/container.di';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

const profile = { name: 'test', about: 'null', country_code: 'RU' };
describe('[E2E] SERVER TEST', () => {
	const user = {
		email: randomEmail(),
		password: '123123',
	};
	const db = authContainer.get<DatabaseAdapter>(ADAPTERS.micro.database);

	it('[AUTH] Init (empty)', async () => {
		await testServer.get(SERVER_PREFIX + serverPaths.init).expect(204);
	});

	it('[REGISTRATION]: Email method', async () => {
		await testServer
			.post(SERVER_PREFIX + serverPaths.registration)
			.field(
				'data',
				JSON.stringify({
					user,
					//@ts-ignore
					profile,
				} satisfies RegistrationDTO),
			)
			.expect(201);
	});

	it('[AUTH] Login', async () =>
		await testServer
			.post(SERVER_PREFIX + serverPaths.login)
			.send(user satisfies LoginDTO)
			.expect(200));

	it('[AUTH] Init (nonempty)', async () => {
		await testServer.get(SERVER_PREFIX + serverPaths.init).expect(200);
	});

	it('[AUTH] Logout', async () => {
		await testServer.delete(SERVER_PREFIX + serverPaths.logout).expect(204);
	});

	// TODO: Починить этот тест
	// it('Not working provider method', async () => {
	// 	await testServer
	// 		.post(SERVER_PREFIX + serverPaths.registration)
	// 		.field(
	// 			'data',
	// 			JSON.stringify({
	// 				user: { email: null, password: null },
	// 				profile,
	// 			} satisfies RegistrationDTO),
	// 		)
	// 		.expect(400);
	// });

	afterAll(async () => {
		await db.db
			.deleteFrom('users')
			// .where(eb => eb('email', '=', email).or('provider_id', '=', provider.id))
			.where(eb => eb('email', '=', user.email))
			.returningAll()
			.execute();
	});
});
