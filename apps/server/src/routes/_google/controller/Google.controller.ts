import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { BaseController } from '../../../config/base.controller';
import passport from 'passport';
import { TYPES } from '../../../containers/TYPES';
import { Passport } from '../passport';
import { ConfigService } from '../../../common/services/config/config.service';

@injectable()
export class GoogleController extends BaseController {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
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

	getLink = passport.authenticate('google', { scope: ['email'] });

	callback = (req: Request, res: Response) => {
		passport.authenticate('google', { failureRedirect: '/fail' }, () => {
			if (req.session.payload) {
				// TODO: ХАРДКОД
				res.redirect('http://localhost:5000');
			} else if (req.session.provider) {
				res.redirect('http://localhost:5000/registration?oauth=true');
			}
		})(req, res);
	};

	protected = async (req: Request, res: Response) => {
		//@ts-ignore
		console.log(req.session.passport);
		console.log('EQEQWEQW');
		res.sendStatus(201);
	};
}
