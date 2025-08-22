import type { ClientProxy } from "@nestjs/microservices";
import { firstValueFrom } from "rxjs";
import type { serverPaths } from "../../../../libs/shared/PATHS";

type Path = keyof typeof serverPaths;

export class MicroserviceMessenger {
	constructor(private readonly client: ClientProxy) {}

	async send<T>(path: string, data?: unknown): Promise<T> {
		return firstValueFrom(this.client.send(path, data ?? {}));
	}

	emit(path: Path, data?: unknown) {
		this.client.emit(path, data ?? {});
	}
}
