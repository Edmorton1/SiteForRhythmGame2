import { BaseController } from '../../../service-config/base.controller';
import { TRACKS_FUNCTIONS } from '../TYPES.di';

export class AuthService extends BaseController {
	constructor() {
		super();
		this.bindFunctions([
			{
				name: TRACKS_FUNCTIONS.auth,
				func: this.handle,
			},
		]);
	}

	handle = (data: any) => {
		console.log('AUTH SERVICE СРАБОТАЛА ФУНКЦИЯ', data);
		return data;
	};
}
