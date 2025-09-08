import jwt, { JwtPayload } from "jsonwebtoken";
import { ConfigService } from "../../common/services/config/config.service";
import { inject, injectable } from "inversify";
import { TYPES } from "../../containers/TYPES";

@injectable()
export class TokenService {
	constructor(
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
	) {}

	verifyToken = <T extends JwtPayload>(token: string): T | null => {
		try {
			return jwt.verify(
				token,
				this.configService.getEnv("JWT_SECRET"),
			) as unknown as T;
		} catch {
			return null;
		}
	};

	generateToken = (payload: object): string => {
		return jwt.sign(payload, this.configService.getEnv("JWT_SECRET"));
	};
}
