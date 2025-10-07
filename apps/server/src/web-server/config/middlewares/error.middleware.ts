import { NextFunction, Request, Response } from 'express';
import { STATUS_CODES } from 'http';
import { inject, injectable } from 'inversify';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';
import { LoggerAdapter } from '../../../common/adapters/logger/logger.adapter';
import { HttpError } from '../../../common/http/http.error';

@injectable()
export class ErrorMiddleware {
	constructor(
		@inject(ADAPTERS.common.logger)
		private readonly logger: LoggerAdapter,
	) {}
	expressError = (
		err: any,
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		this.logger.logger.error({ message: err.message, stack: err.stack });
		if (err instanceof HttpError) {
			console.log('HTTP ERROR');
			res.status(err.statusCode).json({
				status: err.statusCode,
				message: err.message ?? STATUS_CODES[err.statusCode],
			});
			return;
		}
		res.status(500).json({ message: err.message, stack: err.stack });
	};
}
