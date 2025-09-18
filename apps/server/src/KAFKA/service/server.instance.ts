import { injectable } from 'inversify';
import { FUNCS } from './TYPES.di';

// TODO: ЧТО-ТО СДЕЛАТЬ С НЕЙМИНГОМ

export type IFUNCS = keyof typeof FUNCS;

interface Func {
	name: IFUNCS;
	func: Function;
}

@injectable()
export class ServiceInstance {
	//@ts-ignore
	registry: Record<IFUNCS, Function> = {};

	protected bindFunctions = (funcs: Func[]) => {
		console.log(`BIND ROUTES ServiceInstance`, funcs);
		funcs.forEach(res => {
			this.registry[res.name] = res.func;
		});
	};
}
