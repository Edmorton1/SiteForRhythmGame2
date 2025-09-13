import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import supertest from 'supertest';
import { container } from '../../../containers/container.di';
import { ServerExpress } from '../../../config/server';
import { TYPES } from '../../../containers/TYPES';
import { randomEmail } from './generateString';
import { SERVER_PREFIX } from '../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { RegistrationDTO } from '../../../common/models/schemas/registration.dto';
import { DatabaseService } from '../../../common/services/postgres/database.service';
import { mockProviderMiddleware } from './mockProvider.middleware';

// TODO: Убрать дублирование .env

const profile = { name: 'test', about: 'null', country_code: 'RU' };
describe('[REGISTRATION] E2E SUPERTEST', () => {
	let server: ServerExpress;
	const email = randomEmail();
	const databaseService = container.get<DatabaseService>(
		TYPES.services.database,
	);

	beforeAll(() => {
		server = container.get<ServerExpress>(TYPES.app.ServerExpress);
		server.start();
	});

	it('Email method', async () => {
		await supertest(server.app)
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
		await supertest(server.app)
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
		await server.close();
	});
});
