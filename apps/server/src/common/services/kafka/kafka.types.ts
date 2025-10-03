import { BASE_FUNCTIONS } from '../../../web-server/config/kafka.webserver';
import { HttpError } from '../../http/http.error';

export type AnyFunction = (...args: any[]) => any;

export interface KafkaFunc {
	name: string;
	func: AnyFunction;
}

// TODO: Убрать дублирование в рек рес

export interface KafkaRequest<T extends BASE_FUNCTIONS, F extends keyof T> {
	id: string;
	func: F;
	message: T[F]['input'];
}

export interface KafkaResponse<T extends BASE_FUNCTIONS, F extends keyof T> {
	id: string;
	message: T[F]['output'];
	status: 'conform';
}

export interface KafkaError {
	id: string;
	func: string;
	message: HttpError;
	status: 'error';
}
