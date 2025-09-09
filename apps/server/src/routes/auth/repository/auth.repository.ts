import { inject, injectable } from "inversify";
import { TYPES } from "../../../containers/TYPES";
import { DatabaseService } from "../../../common/services/postgres/database.service";
import { HttpError } from "../../../common/http/http.error";
import { UserProfile } from "../../../../../../libs/models/schemas/profile";

@injectable()
export class AuthRepository {
	constructor(
		@inject(TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}

	getPassword = async (email: string) => {
		const user = await this.databaseService.db
			.selectFrom("users")
			.select(["id", "role", "password"])
			.where("email", "=", email)
			.executeTakeFirst();

		console.log("USER", user);

		if (!user?.password) {
			throw new HttpError(401, "No user with such email");
		}

		return { ...user, password: user.password };
	};

	getProfile = async (id: number): Promise<UserProfile> => {
		return await this.databaseService.db
			.selectFrom("profiles")
			.select(["id", "name", "avatar", "country_code"])
			.where("id", "=", id)
			.executeTakeFirstOrThrow();
	};
}
