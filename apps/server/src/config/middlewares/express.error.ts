import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../../common/services/logger/logger.service';
import { HttpError } from '../../common/http/http.error';
import { STATUS_CODES } from 'http';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../containers/TYPES';

@injectable()
export class ExpressError {
	constructor(
		@inject(TYPES.services.logger)
		private readonly loggerService: LoggerService,
	) {}
	expressError = (
		err: any,
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		this.loggerService.logger.error({ message: err.message, stack: err.stack });
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
