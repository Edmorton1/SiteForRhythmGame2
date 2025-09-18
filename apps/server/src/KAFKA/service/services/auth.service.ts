import { ServiceInstance } from '../server.instance';

export class AuthService extends ServiceInstance {
	constructor() {
		super();
		this.bindFunctions([
			{
				name: 'auth',
				func: this.handle,
			},
		]);
	}

	handle = (data: any) => {
		console.log('AUTH SERVICE СРАБОТАЛА ФУНКЦИЯ', data);
		return data;
	};
}
