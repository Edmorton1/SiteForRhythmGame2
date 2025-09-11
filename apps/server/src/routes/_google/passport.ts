import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { TYPES } from '../../containers/TYPES';
import { ConfigService } from '../../common/services/config/config.service';
import { serverPaths } from '../../../../../libs/shared/PATHS';

@injectable()
export class Passport {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		console.log(
			'СОЗДАЛСЯ ЭКЗЕМПЛЯР PASSPORT',
			this.configService.getEnv('URL_SERVER') + serverPaths.authGoogleCallback,
		);
		passport.use(
			new GoogleStrategy(
				{
					clientID: this.configService.getEnv('GOOGLE_CLIENT_ID'),
					clientSecret: this.configService.getEnv('GOOGLE_CLIENT_SECRET'),
					callbackURL:
						this.configService.getEnv('URL_SERVER') +
						serverPaths.authGoogleCallback,
					passReqToCallback: true,
				},
				(req, accessToken, refreshToken, profile, done) => {
					return done(profile);
				},
			),
		);
		passport.serializeUser((user, done) => {
			done(null, user);
		});
	}
}
