import { ServiceInstance } from '../server.instance';

export class TrackService extends ServiceInstance {
	constructor() {
		super();
		this.bindFunctions([
			{
				name: 'tracks',
				func: this.handle,
			},
		]);
	}

	handle = (data: any) => {
		console.log('TRACKS SERVICE СРАБОТАЛА ФУНКЦИЯ', data);
		return data;
	};
}
