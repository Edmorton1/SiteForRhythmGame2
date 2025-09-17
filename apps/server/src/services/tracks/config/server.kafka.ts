import { injectable } from 'inversify';

@injectable()
export class ServerKafka {
	constructor() {}

	// Должен получить единую точку входа, которая получает всё
	start = () => {};

	close = () => {};
}
