import { injectable, multiInject } from 'inversify';
import { BaseService } from './base.service';
import { MICRO } from '../containers/micro.types';
import { AnyFunction } from '../../../common/adapters/kafka/kafka.types';

@injectable()
export class ServiceCollector {
	private allFuncs: Record<string, AnyFunction> = {};

	constructor(
		@multiInject(MICRO.controllers)
		private readonly services: BaseService[],
	) {
		console.log(`КОНСТРУКТОР ServiceComposite`);
		this.services.forEach(s => {
			console.log('ServiceComposite', s);
			this.allFuncs = { ...this.allFuncs, ...s.registry };
		});
		console.log(this.allFuncs);
	}

	use = async (name: string, data: any) => {
		console.log(`USE ${name} ${data}`);

		const func = this.allFuncs[name];

		if (!func) throw new Error(`НЕ ПЕРЕДАНА ФУНКЦИЯ ${name}, ${data}`);

		return await func(data);
	};
}
