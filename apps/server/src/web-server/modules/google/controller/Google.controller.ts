import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import passport from 'passport';
import { ConfigService } from '../../../../common/services/config/config.service';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { BaseController } from '../../../config/base.controller';
import { Passport } from '../passport';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { SERVICES_TYPES } from '../../../../common/containers/SERVICES_TYPES.di';

@injectable()
export class GoogleController extends BaseController {
	constructor(
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
		@inject(WEB_TYPES.oauth.PassportGoogle)
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
