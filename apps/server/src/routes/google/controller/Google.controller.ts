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
				handle: this.redirect,
				method: 'get',
				path: serverPaths.authGoogle,
			},
			{
				handle: this.callback,
				method: 'get',
				path: serverPaths.authGoogleCallback,
			},
		]);
	}

	redirect = passport.authenticate('google', { scope: ['email'] });

	callback = (req: Request, res: Response) => {
		passport.authenticate('google', { failureRedirect: '/fail' }, () => {
			if (req.session.payload) {
				res.redirect(this.configService.getEnv('URL_CLIENT'));
			} else if (req.session.provider) {
				res.redirect(
					// TODO: ХардКод
					`${this.configService.getEnv('URL_CLIENT')}/registration?oauth=true`,
				);
			}
		})(req, res);
	};
}
