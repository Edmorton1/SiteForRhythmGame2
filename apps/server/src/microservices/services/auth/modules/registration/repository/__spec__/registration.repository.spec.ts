import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import { RegistrationRepository } from '../registration.repository';
import { authMicroContainer } from '../../../../container/container.di';
import { randomString } from '../../../../../../../web-server/modules/auth/__e2e__/generateString';
import { SERVICES_TYPES } from '../../../../../../../common/containers/SERVICES_TYPES.di';
import { DatabaseService } from '../../../../../../../common/services/postgres/database.service';
import { LoggerService } from '../../../../../../../common/services/logger/logger.service';
import { Provider } from '../../../../../../../web-server/_declarations/session';
import { AUTH_MICRO_TYPES } from '../../../../container/TYPES.di';
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

const databaseService = authMicroContainer.get<DatabaseService>(
	SERVICES_TYPES.database,
);
const loggerService = authMicroContainer.get<LoggerService>(
	SERVICES_TYPES.logger,
);
const registrationRepository = authMicroContainer.get<RegistrationRepository>(
	AUTH_MICRO_TYPES.repositories.registration,
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
