import { Injectable } from "@nestjs/common";
import crypto from "crypto";

@Injectable()
export class AuthService {
	generateProvider() {
		return crypto
			.randomBytes(16)
			.toString("base64")
			.replace(/\+/g, "0")
			.replace(/\//g, "0")
			.slice(0, 21);
	}
}
