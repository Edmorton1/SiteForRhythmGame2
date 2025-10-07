import { injectable } from 'inversify';
// prettier-ignore
import { AnyFunction, KafkaFunc } from '../../../common/services/kafka/kafka.types';

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
