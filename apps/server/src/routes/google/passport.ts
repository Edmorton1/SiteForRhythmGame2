import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { TYPES } from '../../containers/TYPES';
import { ConfigService } from '../../common/services/config/config.service';
import { serverPaths } from '../../../../../libs/shared/PATHS';
import { GoogleRepository } from './repository/Google.repository';

@injectable()
export class Passport {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
		@inject(TYPES.modules.google.repository)
		private readonly googleRepository: GoogleRepository,
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
				async (req, accessToken, refreshToken, profile, done) => {
					const id = await this.googleRepository.getUserId(profile.id);
					if (id) {
						req.session.payload = { id, role: 'user' };
					} else {
						const email = profile._json.email;
						if (!email) {
							throw new Error('Email not found');
						}
						req.session.provider = {
							id: profile.id,
							email,
							provider: profile.provider,
						};
					}

					return done(null, false);
				},
			),
		);
	}
}
