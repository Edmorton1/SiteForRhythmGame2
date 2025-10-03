import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ConfigService } from '../../../common/services/config/config.service';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { KafkaWebServer } from '../../config/kafka.webserver';
import { SERVICES_TYPES } from '../../../common/containers/SERVICES_TYPES.di';
import { WEB_TYPES } from '../../container/TYPES.di';
import { TOPICS } from '../../../common/topics/TOPICS';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../common/modules/auth/auth.functions';

@injectable()
export class Passport {
	constructor(
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
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
					const id = await this.kafkaWebServer.sendAndWait<
						AUTH_FUNCTIONS,
						'getUserId'
					>(
						{
							func: AUTH_KEYS.getUserId,
							message: profile.id,
						},
						TOPICS.requests.auth,
					);
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
