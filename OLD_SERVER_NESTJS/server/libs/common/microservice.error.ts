import { RpcException } from '@nestjs/microservices';
import { STATUS_CODES } from 'http';

export class MicroserviceError extends RpcException {
	constructor(statusCode: number, errorMessage?: string) {
		super({ statusCode, message: errorMessage ?? STATUS_CODES[statusCode] });
	}
}
