import { inject, injectable } from "inversify";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { TYPES } from "../../containers/TYPES";
import { ConfigService } from "../../common/services/config/config.service";

@injectable()
export class Passport {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		passport.use(
			new GoogleStrategy(
				{
					clientID: this.configService.getEnv("GOOGLE_CLIENT_ID"),
					clientSecret: this.configService.getEnv("GOOGLE_CLIENT_SECRET"),
					callbackURL: "http://localhost:5000/api/redirect",
				},
				(accessToken, refreshToken, profile, done) => {
					User.findOrCreate({ googleId: profile.id }, function (err, user) {
						return done(err, user);
					});
				},
			),
		);
	}
}
