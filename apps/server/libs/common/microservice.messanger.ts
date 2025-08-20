import type { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import { UserDTOZodSchema } from "../../../../libs/types/database.types.dto";
import type { serverPaths } from "../../../../libs/shared/PATHS";

type Path = keyof typeof serverPaths;

export class MicroserviceMessenger {
	constructor(private readonly client: ClientProxy) {}

	async send(path: string, data?: any) {
		console.log("ПАРАМЕТРЫ", path, data);
		return firstValueFrom(this.client.send(path, data ?? {}));
	}

	emit(path: Path, data?: any) {
		this.client.emit(path, data ?? {});
	}
}
console.log(UserDTOZodSchema);
