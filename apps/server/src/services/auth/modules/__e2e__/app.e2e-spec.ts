import { COMMON_TYPES } from '../../../../containers/TYPES.di';
import { randomEmail } from './generateString';
import { SERVER_PREFIX } from '../../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { RegistrationDTO } from '../../../../common/models/schemas/registration.dto';
import { DatabaseService } from '../../../../common/services/postgres/database.service';
import { testServer } from './supertest';
import { LoginDTO } from '../../../../../../../libs/models/schemas/auth';
import { authContainer } from '../../containers/container.di';

const profile = { name: 'test', about: 'null', country_code: 'RU' };
describe('[E2E] SERVER TEST', () => {
	const user = {
		email: randomEmail(),
		password: '123123',
	};
	const databaseService = authContainer.get<DatabaseService>(
		COMMON_TYPES.services.database,
	);

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
		await databaseService.db
			.deleteFrom('users')
			// .where(eb => eb('email', '=', email).or('provider_id', '=', provider.id))
			.where(eb => eb('email', '=', user.email))
			.returningAll()
			.execute();
	});
});
