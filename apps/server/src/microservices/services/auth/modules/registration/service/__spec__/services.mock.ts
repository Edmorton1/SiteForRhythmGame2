import 'reflect-metadata';
import { RegistrationRepository } from '../../repository/registration.repository';
import { RegistrationDTO } from '../../../../../../../common/models/schemas/registration.dto';
import { Profile } from '../../../../../../../../../../libs/models/schemas/profile';
import { RegistrationService } from '../registration.service';

export const mockProfileDTO: RegistrationDTO['profile'] = {
	name: 'name',
	about: 'about',
	country_code: 'RU',
};

export const mockProfile: Profile = {
	...mockProfileDTO,
	id: 1,
	created_at: 'today',
	avatar: null,
};

export const mockResult = {
	token: 'V7fHc9LpQ2xDkR6wMzS1',
	profile: mockProfile,
};

const registrationSQLMock: jest.Mocked<Partial<RegistrationRepository>> = {
	isInDB: jest.fn().mockResolvedValue(false),
	registrationEmail: jest.fn().mockResolvedValue(mockResult),
	registrationProvider: jest.fn().mockResolvedValue(mockResult),
};

export const mockRegistrationService: RegistrationService =
	new RegistrationService(
		registrationSQLMock as unknown as RegistrationRepository,
	);
