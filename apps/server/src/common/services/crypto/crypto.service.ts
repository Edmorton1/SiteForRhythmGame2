import { randomBytes } from "crypto";

export class CryptoService {
	generateProvider = () => {
		return randomBytes(16)
			.toString("base64")
			.replace(/[/+=]/g, "U")
			.slice(0, 21);
	};
}
