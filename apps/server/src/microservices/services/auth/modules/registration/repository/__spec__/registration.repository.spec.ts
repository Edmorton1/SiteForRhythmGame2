import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { RegistrationRepository } from '../registration.repository';
import { authContainer } from '../../../../container/container.di';
import { randomString } from '../../../../../../../common/test_rename/generateString';
import { ADAPTERS } from '../../../../../../../common/adapters/container/adapters.types';
import { DatabaseAdapter } from '../../../../../../common/adapters/postgres/database.adapters';
import { LoggerAdapter } from '../../../../../../../common/adapters/logger/logger.adapter';
import { Provider } from '../../../../../../../common/_declarations/session';
import { AUTH } from '../../../../container/auth.types';
import { RegistrationDTO } from '../../../../../../../common/models/schemas/registration.dto';

// TODO: make name without collision
const provider = {
	id: '232345702304832093543',
	email: 'test@example.ru',
	provider: 'google',
} satisfies Provider;
const email = '_test';

// SELECT pid, usename, datname, client_addr, state, query
// FROM pg_stat_activity;

const database = authContainer.get<DatabaseAdapter>(ADAPTERS.micro.database);
const logger = authContainer.get<LoggerAdapter>(ADAPTERS.common.logger);
const registrationRepository = authContainer.get<RegistrationRepository>(
	AUTH.repositories.registration,
);

const profileDTO: RegistrationDTO['profile'] = {
	about: '',
	country_code: 'RU',
	// TODO: make name without collision
	name: randomString(32),
};

describe('[REGISTRATION] Repository', () => {
	it('Email method', async () => {
		const profile = await registrationRepository.registrationEmail({
			user: { email: '_test', password: '123123' },
			profile: profileDTO,
		});
		expect(profile).toBeDefined();
	});

	it('Provider method', async () => {
		const profile = await registrationRepository.registrationProvider(
			{ profile: profileDTO },
			provider,
		);
		console.log('PROFILE', profile);
		expect(profile).toBeDefined();
	});

	afterEach(async () => {
		await database.db
			.deleteFrom('users')
			.where(eb => eb('email', '=', email).or('provider_id', '=', provider.id))
			.returningAll()
			.execute();
	});

	afterAll(async () => {
		await database.disconnect();
		logger.logger.flush();
	});
});
