import type { ClientProxy } from '@nestjs/microservices';
import { MicroserviceMessenger } from './microservice.messenger';

export abstract class HttpController {
	protected readonly messenger: MicroserviceMessenger;

	constructor(private readonly client: ClientProxy) {
		this.messenger = new MicroserviceMessenger(this.client);
	}
}
