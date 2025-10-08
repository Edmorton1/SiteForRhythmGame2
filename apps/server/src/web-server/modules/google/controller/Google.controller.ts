import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import passport from 'passport';
import { ConfigAdapter } from '../../../../common/adapters/config/config.adapter';
import { serverPaths } from '../../../../../../../libs/common/PATHS';
import { BaseController } from '../../../config/controllers/base.controller';
import { Passport } from '../passport';
import { WEB } from '../../../container/web.di';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

@injectable()
export class GoogleController extends BaseController {
	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
		@inject(WEB.oauth.PassportGoogle)
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
				res.redirect(this.config.getEnv('URL_CLIENT'));
			} else if (req.session.provider) {
				res.redirect(
					// TODO: ХардКод
					`${this.config.getEnv('URL_CLIENT')}/registration?oauth=true`,
				);
			}
		})(req, res);
	};
}
