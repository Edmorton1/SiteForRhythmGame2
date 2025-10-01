import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { KafkaWebServer } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';

@injectable()
export class _Controller extends BaseController {
	constructor(
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.handle,
				method: 'get',
				path: serverPaths.,
			},
		]);
	}

	handle = async (req: Request, res: Response) => {
		await this.kafkaWebServer.sendAndWait({})
	};
}
