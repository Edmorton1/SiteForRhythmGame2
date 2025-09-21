import { inject, injectable } from 'inversify';
import { DatabaseService } from '../../../../../../common/services/postgres/database.service';
import { HttpError } from '../../../../../../common/http/http.error';
import { authErrors } from '../../../../../../web-server/modules/auth/errors/CONST';
import { UserProfile } from '../../../../../../../../../libs/models/schemas/profile';
import { SERVICES_TYPES } from '../../../../../../common/containers/SERVICES_TYPES.di';

@injectable()
export class AuthRepository {
	constructor(
		@inject(SERVICES_TYPES.database)
		private readonly databaseService: DatabaseService,
	) {}

	getPassword = async (email: string) => {
		const user = await this.databaseService.db
			.selectFrom('users')
			.select(['id', 'role', 'password'])
			.where('email', '=', email)
			.executeTakeFirst();

		console.log('USER', user);

		if (!user?.password) {
			throw new HttpError(404, authErrors.NO_EMAIL);
		}

		return { ...user, password: user.password };
	};

	getProfileById = async (id: number): Promise<UserProfile> => {
		console.log(
			'GET PROFILE BY ID | ЕСЛИ УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ ИЗ БД И НЕ ОБНОВИТЬ СЕССИЮ, БУДЕТ ОШИБКА',
		);
		return await this.databaseService.db
			.selectFrom('profiles')
			.select(['id', 'name', 'avatar', 'country_code'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	};
}
