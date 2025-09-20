import { injectable } from 'inversify';
import { AnyFunction, KafkaFunc } from './types';

@injectable()
export class BaseService {
	registry: Record<string, AnyFunction> = {};

	protected bindFunctions = (funcs: KafkaFunc[]) => {
		console.log(`BIND FUNCTIONS ServiceInstance`, funcs);
		funcs.forEach(res => {
			this.registry[res.name] = res.func;
		});
	};
}

// export class BaseController<T extends string> {
// 	registry: Partial<Record<T, AnyFunction>> = {};

// 	protected bindFunctions = (funcs: KafkaFunc<T>[]) => {
// 		console.log(`BIND FUNCTIONS ServiceInstance`, funcs);
// 		funcs.forEach(res => {
// 			this.registry[res.name] = res.func;
// 		});
// 	};
// }
