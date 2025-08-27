import jwt, { JwtPayload } from "jsonwebtoken";
import { injectable } from "tsyringe";
import { ConfigService } from "../../common/services/config/config.service";

@injectable()
export class TokenService {
	constructor(private readonly configService: ConfigService) {}

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
