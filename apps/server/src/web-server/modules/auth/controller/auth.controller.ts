import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/controllers/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { userGuard } from '../../../common/guards/user.guard';
import { LoginDTOZodSchema } from '../../../../../../../libs/models/schemas/auth';
import { ZodValidateSchema } from '../../../common/pipes/zod.pipe';
import { ConfigService } from '../../../../common/services/config/config.service';
import { SERVICES_TYPES } from '../../../../common/containers/SERVICES_TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
import { AUTH_FUNCTIONS } from '../../../../common/modules/auth/auth.functions';
// prettier-ignore
import { KafkaMessenger, KafkaSender } from '../../../common/services/packages/kafka/kafka.messenger';
import { WEB_SERVICES_TYPES } from '../../../common/services/containers/SERVICES_TYPES.di';

@injectable()
export class AuthController extends BaseController {
	sender: KafkaSender<AUTH_FUNCTIONS>;

	constructor(
		@inject(WEB_SERVICES_TYPES.kafkaMessenger)
		private readonly kafkaMessenger: KafkaMessenger,
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
		this.sender = this.kafkaMessenger.initSender<AUTH_FUNCTIONS>();
	}

	login = async (req: Request, res: Response) => {
		const userDTO = ZodValidateSchema(LoginDTOZodSchema, req.body);
		const { payload, profile } = await this.sender.sendAndWait(
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
		const profile = await this.sender.sendAndWait(
			{
				func: 'init',
				message: id,
			},
			TOPICS.requests.auth,
		);
		res.json(profile);
	};
}
