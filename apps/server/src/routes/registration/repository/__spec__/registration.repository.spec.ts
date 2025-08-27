import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import { container } from "tsyringe";
import { RegistrationRepository } from "../registration.repository";
import { DatabaseService } from "../../../../common/services/postgres/database.service";
import { ConfigService } from "../../../../common/services/config/config.service";
import { LoggerService } from "../../../../common/services/logger/logger.service";
import { AuthDTO } from "../../../../common/models/schemas/auth.dto";

const provider = "AasdhashdASHDAhdasdha";
const email = "_test";
// БЕЗ ЭТОГО ЗАВИСАЕТ
container.registerSingleton(ConfigService, ConfigService);
container.registerSingleton(LoggerService, LoggerService);
container.registerSingleton(DatabaseService, DatabaseService);
// SELECT pid, usename, datname, client_addr, state, query
// FROM pg_stat_activity;

const databaseService = container.resolve(DatabaseService);
const loggerService = container.resolve(LoggerService);
const registrationRepository = container.resolve(RegistrationRepository);

const profileDTO: AuthDTO["profile"] = {
	about: "",
	country_code: "RU",
	// TODO: make name without collision
	name: "_test",
};

describe("[REGISTRATION] Repository", () => {
	beforeAll(() => {});

	it("Email method", async () => {
		const { profile } = await registrationRepository.registrationEmail({
			user: { email: "_test", password: "123123" },
			profile: profileDTO,
		});
		expect(profile).toBeDefined();
	});

	it("Provider method", async () => {
		const { profile } = await registrationRepository.registrationProvider(
			{ profile: profileDTO },
			provider,
		);
		console.log("PROFILE", profile);
		expect(profile).toBeDefined();
	});

	afterEach(async () => {
		await databaseService.db
			.deleteFrom("users")
			.where(eb => eb("email", "=", email).or("provider_id", "=", provider))
			.returningAll()
			.execute();
	});

	afterAll(async () => {
		await databaseService.disconnect();
		loggerService.logger.flush();
	});
});
