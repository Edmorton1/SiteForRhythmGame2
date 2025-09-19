export type AnyFunction = (...args: any[]) => any;

export interface KafkaFunc {
	name: string;
	func: AnyFunction;
}

export interface KafkaResponse {
	id: string;
	func: string;
	message: any;
}
