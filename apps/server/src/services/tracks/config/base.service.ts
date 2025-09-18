import { Ids } from '../../../config/kafka.controller';

export class BaseService {
	consumers: Ids[] = [];

	protected bindConsumer = (connections: Ids[]) => {
		this.consumers.push(...connections);
	};
}
