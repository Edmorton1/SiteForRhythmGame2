import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ConfigService } from '../../../common/services/config/config.service';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import { KafkaController } from '../../../common/services/kafka/kafka.controller';
import { AUTH_FUNCTIONS } from '../../../microservices/services/auth/container/TYPES.di';
import { SERVICES_TYPES } from '../../../common/containers/SERVICES_TYPES.di';

@injectable()
export class Passport {
	constructor(
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
		@inject(SERVICES_TYPES.kafkaController)
		private readonly kafkaController: KafkaController,
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
					const id = await this.kafkaController.sendAndWait<number>({
						func: AUTH_FUNCTIONS.getUserId,
						message: profile.id,
					});
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
