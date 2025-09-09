import { DatabaseService } from "../../../common/services/postgres/database.service";
import bcrypt from "bcrypt";
import { AuthDTO } from "../../../common/models/schemas/auth.dto";
import { DatabaseKysely } from "../../../common/services/postgres/database.type";
import { sql, Transaction } from "kysely";
import { User, UserDTO } from "../../../../../../libs/models/schemas/user";
import { randomUUID } from "crypto";
import { Profile } from "../../../../../../libs/models/schemas/profile";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../containers/TYPES";

type ProfileAvatar = Omit<AuthDTO, "user">;

type RoleId = Pick<User, "id" | "role">;

@injectable()
export class RegistrationRepository {
	constructor(
		@inject(TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}

	registrationEmail = async (authDTO: AuthDTO): Promise<Profile> => {
		return this.registration(authDTO, trx =>
			this.createUser(trx, authDTO.user),
		);
	};

	registrationProvider = async (
		profileDTO: ProfileAvatar,
		provider_id: string,
	): Promise<Profile> => {
		return this.registration(profileDTO, trx =>
			this.insertUser(trx, { provider_id }),
		);
	};

	private registration = async (
		authDTO: ProfileAvatar,
		insertUser: (trx: Transaction<DatabaseKysely>) => Promise<RoleId>,
	): Promise<Profile> => {
		const avatar = authDTO.avatar
			? await this.uploadAvatar(authDTO.avatar)
			: null;

		return this.databaseService.db.transaction().execute(async trx => {
			const Payload = await insertUser(trx);

			const [profile] = await trx
				.insertInto("profiles")
				.values({ ...authDTO.profile, id: Payload.id, avatar })
				.returningAll()
				.execute();
			return profile;
		});
	};

	private uploadAvatar = async (
		avatar: Express.Multer.File,
	): Promise<string | null> => {
		// TODO: Mocking upload avatar
		return randomUUID();
	};

	private insertUser = async (
		trx: Transaction<DatabaseKysely>,
		value: UserDTO | { provider_id: string },
	): Promise<RoleId> => {
		const [userRoleId] = await trx
			.insertInto("users")
			.values(value)
			.returning(["id", "role"])
			.execute();
		return userRoleId;
	};

	private createUser = async (
		trx: Transaction<DatabaseKysely>,
		userDTO: AuthDTO["user"],
	): Promise<RoleId> => {
		// TODO: set many salt
		const hashPassword = await bcrypt.hash(userDTO.password!, 3);
		return await this.insertUser(trx, {
			...userDTO,
			password: hashPassword,
		});
	};

	isInDB = async <T extends keyof DatabaseKysely>(
		table: T,
		param: keyof DatabaseKysely[T],
		// USER INPUT
		value: string,
	): Promise<boolean> => {
		const { rows } = await sql<{ exists: boolean }>`
		SELECT EXISTS(
			SELECT 1
			FROM ${sql.table(table)}
			WHERE ${sql.ref(String(param))} = ${value}
		)`.execute(this.databaseService.db);

		return rows[0].exists;
	};
}
