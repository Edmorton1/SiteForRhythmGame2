import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { BaseController } from '../../../config/base.controller';
import passport from 'passport';
import { TYPES } from '../../../containers/TYPES';
import { Passport } from '../passport';

@injectable()
export class GoogleController extends BaseController {
	constructor(
		@inject(TYPES.oauth.PassportGoogle)
		private readonly pass: Passport,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.getLink,
				method: 'get',
				path: serverPaths.authGoogle,
			},
			{
				handle: this.callback,
				method: 'get',
				path: serverPaths.authGoogleCallback,
			},
			{
				handle: this.protected,
				method: 'get',
				path: '/protected',
			},
		]);
	}

	getLink = passport.authenticate('google', { scope: ['email', 'profile'] });

	callback = passport.authenticate('google', {
		successFlash: '/protected',
		failureRedirect: '/fail',
	});

	protected = async (req: Request, res: Response) => {
		console.log(req);
		res.sendStatus(201);
	};
}
