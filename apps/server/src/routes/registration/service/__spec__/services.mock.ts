import "reflect-metadata";
import { CryptoService } from "../../../../common/services/crypto/crypto.service";
import { RegistrationService } from "../registration.service";
import { TokenService } from "../../token.service";
import { RegistrationRepository } from "../../repository/registration.repository";
import { AuthDTO } from "../../../../common/models/schemas/auth.dto";
import { Profile } from "../../../../../../../libs/models/schemas/profile";

export const mockProfileDTO: AuthDTO["profile"] = {
	name: "name",
	about: "about",
	country_code: "RU",
};

export const mockProfile: Profile = {
	...mockProfileDTO,
	id: 1,
	created_at: "today",
	avatar: null,
};

export const mockResult = {
	token: "V7fHc9LpQ2xDkR6wMzS1",
	profile: mockProfile,
};

const tokenServiceMock: jest.Mocked<Partial<TokenService>> = {
	verifyToken: jest
		.fn()
		.mockReturnValue({ provider_id: "G8mYq3RwT5vKpL2sNzX4" }),
	generateToken: jest.fn().mockReturnValue("V7fHc9LpQ2xDkR6wMzS1"),
};

const registrationSQLMock: jest.Mocked<Partial<RegistrationRepository>> = {
	isInDB: jest.fn().mockResolvedValue(false),
	registrationEmail: jest.fn().mockResolvedValue(mockResult),
	registrationProvider: jest.fn().mockResolvedValue(mockResult),
};

const cryptoServiceMock: jest.Mocked<Partial<CryptoService>> = {};

export const mockRegistrationService: RegistrationService =
	new RegistrationService(
		registrationSQLMock as unknown as RegistrationRepository,
		tokenServiceMock as unknown as TokenService,
		cryptoServiceMock as unknown as CryptoService,
	);
