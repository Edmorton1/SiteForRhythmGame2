// export class Modules {
// 	constructor(
// 		public controller: symbol,
// 		public service: symbol,
// 		public repository: symbol,
// 	) {}
// }

export const MODULE = 'modules=';

export type Module = Record<
	string,
	{ controller: symbol; service?: symbol; repository: symbol }
>;
