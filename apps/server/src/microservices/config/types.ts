export type AnyFunction = (...args: any[]) => any;

export interface KafkaFunc {
	name: string;
	func: AnyFunction;
}

export interface KafkaResponse {
	id: string;
	func: string;
	// TODO: Потом сделать unknown
	message: any;
	status: 'conform' | 'error';
}
