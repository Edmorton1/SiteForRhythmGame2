import { HttpError } from '../../http/http.error';

export type AnyFunction = (...args: any[]) => any;

export interface KafkaFunc {
	name: string;
	func: AnyFunction;
}

// TODO: Убрать дублирование в рек рес

export interface KafkaRequest {
	id: string;
	func: string;
	message: any;
}

export interface KafkaResponse {
	id: string;
	message: any;
	status: 'conform';
}

export interface KafkaError {
	id: string;
	func: string;
	message: HttpError;
	status: 'error';
}
