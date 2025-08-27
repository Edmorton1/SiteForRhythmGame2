import "reflect-metadata";
import { ConfigService } from "../../../../common/services/config/config.service";
import { CryptoService } from "../../../../common/services/crypto/crypto.service";
import { RegistrationController } from "../registration.controller";
import { RegistrationService } from "../../service/registration.service";
import { TokenService } from "../../token.service";
import { mockData } from "./data.mock";

const tokenServiceMock: jest.Mocked<Partial<TokenService>> = {
	verifyToken: jest
		.fn()
		.mockReturnValue({ providerId: "G8mYq3RwT5vKpL2sNzX4" }),
	generateToken: jest.fn().mockReturnValue("V7fHc9LpQ2xDkR6wMzS1"),
};

const registrationServiceMock: jest.Mocked<Partial<RegistrationService>> = {
	registrationWithEmail: jest.fn().mockResolvedValue(mockData),
	registrationWithProvider: jest.fn().mockResolvedValue(mockData),
};

const cryptoServiceMock: jest.Mocked<Partial<CryptoService>> = {};

const configServiceMock: jest.Mocked<Partial<ConfigService>> = {};

export const mockRegistrationController: RegistrationController =
	new RegistrationController(
		registrationServiceMock as unknown as RegistrationService,
		cryptoServiceMock as unknown as CryptoService,
		configServiceMock as unknown as ConfigService,
		tokenServiceMock as unknown as TokenService,
	);
