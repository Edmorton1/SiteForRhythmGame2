import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { RegistrationRepository } from '../registration.repository';
import { DatabaseService } from '../../../../common/services/postgres/database.service';
import { LoggerService } from '../../../../common/services/logger/logger.service';
import { RegistrationDTO } from '../../../../common/models/schemas/registration.dto';
import { container } from '../../../../containers/container.di';
import { TYPES } from '../../../../containers/TYPES';

// TODO: make name without collision
const provider = {
	id: '232345702304832093543',
	email: 'test@example.ru',
	provider: 'google',
};
const email = '_test';

// SELECT pid, usename, datname, client_addr, state, query
// FROM pg_stat_activity;

const databaseService = container.get<DatabaseService>(TYPES.services.database);
const loggerService = container.get<LoggerService>(TYPES.services.logger);
const registrationRepository = container.get<RegistrationRepository>(
	TYPES.modules.registration.repository,
);

const profileDTO: RegistrationDTO['profile'] = {
	about: '',
	country_code: 'RU',
	// TODO: make name without collision
	name: '_test',
};

describe('[REGISTRATION] Repository', () => {
	beforeAll(() => {});

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
		await databaseService.db
			.deleteFrom('users')
			.where(eb => eb('email', '=', email).or('provider_id', '=', provider))
			.returningAll()
			.execute();
	});

	afterAll(async () => {
		await databaseService.disconnect();
		loggerService.logger.flush();
	});
});
