export const MODULE = Symbol.for('Modules');
export const CONTAINER = Symbol.for('Container');

export type Module = Record<
	string,
	{ controller: symbol; service?: symbol; repository: symbol }
>;
