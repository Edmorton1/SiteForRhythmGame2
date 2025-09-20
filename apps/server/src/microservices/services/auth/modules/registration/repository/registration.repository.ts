import bcrypt from 'bcrypt';
import { sql, Transaction } from 'kysely';
import { randomUUID } from 'crypto';
import { inject, injectable } from 'inversify';
//prettier-ignore
import { User, UserDTO } from '../../../../../../../../../libs/models/schemas/user';
import { RegistrationDTO } from '../../../../../../common/models/schemas/registration.dto';
import { MICRO_TYPES } from '../../../../../config/containers/TYPES.di';
import { DatabaseService } from '../../../../../../common/services/postgres/database.service';
import { Profile } from '../../../../../../../../../libs/models/schemas/profile';
import { DatabaseKysely } from '../../../../../../common/services/postgres/database.type';
import { Provider } from '../../../../../../web-server/_declarations/session';

type ProfileAvatar = Omit<RegistrationDTO, 'user'>;

type RoleId = Pick<User, 'id' | 'role'>;

@injectable()
export class RegistrationRepository {
	constructor(
		@inject(MICRO_TYPES.services.database)
		private readonly databaseService: DatabaseService,
	) {}

	registrationEmail = async (authDTO: RegistrationDTO): Promise<Profile> => {
		return this.registration(authDTO, trx =>
			this.createUser(trx, authDTO.user),
		);
	};

	registrationProvider = async (
		profileDTO: ProfileAvatar,
		provider: Provider,
	): Promise<Profile> => {
		return this.registration(profileDTO, trx =>
			this.insertUser(trx, { provider_id: provider.id, email: provider.email }),
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
			const profile = await trx
				.insertInto('profiles')
				.values({ ...authDTO.profile, id: Payload.id, avatar })
				.returningAll()
				.executeTakeFirstOrThrow();
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
		const userRoleId = await trx
			.insertInto('users')
			.values(value)
			.returning(['id', 'role'])
			.executeTakeFirstOrThrow();
		return userRoleId;
	};

	private createUser = async (
		trx: Transaction<DatabaseKysely>,
		userDTO: RegistrationDTO['user'],
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
