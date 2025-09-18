import { injectable } from 'inversify';
import { microserviceContainer } from './containers/container.di';
import { IFUNCS, ServiceInstance } from './server.instance';
import { MICRO_TYPES } from './TYPES.di';

@injectable()
export class ServiceComposite {
	//@ts-ignore
	private allFuncs: Record<IFUNCS, Function> = {};

	constructor() {
		console.log(`КОНСТРУКТОР ServiceComposite`);
		Object.values(MICRO_TYPES.microservices).forEach(service => {
			console.log('ServiceComposite', service);
			// TODO: ЗАФАБРИКОВАТЬ КОНТЕЙНЕР
			const registry =
				microserviceContainer.get<ServiceInstance>(service).registry;
			this.allFuncs = { ...this.allFuncs, ...registry };
		});
		console.log(this.allFuncs);
	}

	use = async (name: IFUNCS, data: any) => {
		console.log(`USE ${name} ${data}`);
		return await this.allFuncs[name](data);
	};
}
