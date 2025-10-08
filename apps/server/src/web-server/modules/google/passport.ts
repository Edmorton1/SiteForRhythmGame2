import { inject, injectable } from 'inversify';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { ConfigAdapter } from '../../../common/adapters/config/config.adapter';
import { serverPaths } from '../../../../../../libs/common/PATHS';
import { ADAPTERS } from '../../../common/adapters/container/adapters.types';
import { TOPICS } from '../../../common/topics/TOPICS';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../common/modules/auth/auth.functions';
import { KafkaSender } from '../../common/adapters/kafka.sender';

@injectable()
export class Passport {
	constructor(
		@inject(ADAPTERS.common.config)
		private readonly config: ConfigAdapter,
		@inject(ADAPTERS.web.kafkaSender)
		private readonly KafkaSender: KafkaSender,
	) {
		console.log(
			'СОЗДАЛСЯ ЭКЗЕМПЛЯР PASSPORT',
			this.config.getEnv('URL_SERVER') + serverPaths.authGoogleCallback,
		);
		const { sendAndWait } = this.KafkaSender.initSender<AUTH_FUNCTIONS>();
		passport.use(
			new GoogleStrategy(
				{
					clientID: this.config.getEnv('GOOGLE_CLIENT_ID'),
					clientSecret: this.config.getEnv('GOOGLE_CLIENT_SECRET'),
					callbackURL:
						this.config.getEnv('URL_SERVER') + serverPaths.authGoogleCallback,
					passReqToCallback: true,
				},
				async (req, accessToken, refreshToken, profile, done) => {
					const id = await sendAndWait(
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
