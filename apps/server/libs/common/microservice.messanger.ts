import type { ClientProxy } from "@nestjs/microservices";
import type { serverPaths } from "@libs/shared/PATHS";
import { firstValueFrom } from "rxjs";

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
