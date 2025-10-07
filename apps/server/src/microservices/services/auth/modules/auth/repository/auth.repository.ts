import { inject, injectable } from 'inversify';
import { DatabaseAdapter } from '../../../../../common/adapters/postgres/database.adapters';
import { HttpError } from '../../../../../../common/http/http.error';
import { authErrors } from '../../../../../../common/modules/auth/errors/auth';
import { ADAPTERS } from '../../../../../../common/adapters/container/adapters.types';

@injectable()
export class AuthRepository {
	constructor(
		@inject(ADAPTERS.micro.database)
		private readonly db: DatabaseAdapter,
	) {}

	getPassword = async (email: string) => {
		const user = await this.db.db
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

	getProfileById = async (id: number) => {
		console.log(
			'GET PROFILE BY ID | ЕСЛИ УДАЛИТЬ ПОЛЬЗОВАТЕЛЯ ИЗ БД И НЕ ОБНОВИТЬ СЕССИЮ, БУДЕТ ОШИБКА',
		);
		return await this.db.db
			.selectFrom('profiles')
			.select(['id', 'name', 'avatar', 'country_code'])
			.where('id', '=', id)
			.executeTakeFirstOrThrow();
	};
}
