import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { RegistrationRepository } from '../registration.repository';
import { DatabaseService } from '../../../../common/services/postgres/database.service';
import { LoggerService } from '../../../../common/services/logger/logger.service';
import { RegistrationDTO } from '../../../../common/models/schemas/registration.dto';
import { container } from '../../../../containers/container.di';
import { COMMON_TYPES } from '../../../../containers/TYPES.di';
import { Provider } from '../../../../_declarations/session';
import { randomString } from '../../../__e2e__/generateString';

// TODO: make name without collision
const provider = {
	id: '232345702304832093543',
	email: 'test@example.ru',
	provider: 'google',
} satisfies Provider;
const email = '_test';

// SELECT pid, usename, datname, client_addr, state, query
// FROM pg_stat_activity;

const databaseService = container.get<DatabaseService>(
	COMMON_TYPES.services.database,
);
const loggerService = container.get<LoggerService>(
	COMMON_TYPES.services.logger,
);
const registrationRepository = container.get<RegistrationRepository>(
	COMMON_TYPES.modules.registration.repository,
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
		await databaseService.db
			.deleteFrom('users')
			.where(eb => eb('email', '=', email).or('provider_id', '=', provider.id))
			.returningAll()
			.execute();
	});

	afterAll(async () => {
		await databaseService.disconnect();
		loggerService.logger.flush();
	});
});
