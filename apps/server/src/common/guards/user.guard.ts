import { NextFunction, Request, Response } from 'express';

export const userGuard = (req: Request, res: Response, next: NextFunction) => {
	const payload = req.session.payload;
	console.log('PAYTLOAD', payload);

	if (!payload) {
		res.sendStatus(401);
		return;
	}

	next();
};
