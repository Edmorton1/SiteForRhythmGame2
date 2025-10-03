import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { userGuard } from '../../../common/guards/user.guard';
import { LoginDTOZodSchema } from '../../../../../../../libs/models/schemas/auth';
import { ZodValidateSchema } from '../../../common/pipes/zod.pipe';
import { ConfigService } from '../../../../common/services/config/config.service';
import { KafkaWebServer } from '../../../config/kafka.webserver';
import { SERVICES_TYPES } from '../../../../common/containers/SERVICES_TYPES.di';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
import { AUTH_FUNCTIONS } from '../../../../common/modules/auth/auth.functions';

@injectable()
export class AuthController extends BaseController {
	constructor(
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
		@inject(SERVICES_TYPES.config)
		private readonly configService: ConfigService,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.login,
				method: 'post',
				path: serverPaths.login,
			},
			{
				handle: this.logout,
				method: 'delete',
				path: serverPaths.logout,
				middlewares: [userGuard],
			},
			{
				handle: this.init,
				method: 'get',
				path: serverPaths.init,
			},
		]);
	}

	login = async (req: Request, res: Response) => {
		const userDTO = ZodValidateSchema(LoginDTOZodSchema, req.body);
		const { payload, profile } = await this.kafkaWebServer.sendAndWait<
			AUTH_FUNCTIONS,
			'login'
		>(
			{
				func: 'login',
				message: userDTO,
			},
			TOPICS.requests.auth,
		);

		req.session.regenerate(err => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
				return;
			}

			req.session.payload = payload;
			res.json(profile);
		});
	};

	logout = (req: Request, res: Response) => {
		req.session.destroy(err => {
			if (err) console.error(err);
			res.clearCookie(this.configService.getEnv('COOKIE_NAME')).sendStatus(204);
		});
	};

	init = async (req: Request, res: Response) => {
		if (!req.session.payload) {
			res.sendStatus(204);
			return;
		}
		const id = req.session.payload.id;
		const profile = await this.kafkaWebServer.sendAndWait<
			AUTH_FUNCTIONS,
			'init'
		>(
			{
				func: 'init',
				message: id,
			},
			TOPICS.requests.auth,
		);
		res.json(profile);
	};
}
