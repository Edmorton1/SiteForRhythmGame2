import { Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { userGuard } from '../../../common/guards/user.guard';
import {
	Profile,
	UserProfile,
} from '../../../../../../../libs/models/schemas/profile';
import { LoginDTOZodSchema } from '../../../../../../../libs/models/schemas/auth';
import { ZodValidateSchema } from '../../../common/pipes/zod.pipe';
import { ConfigService } from '../../../../common/services/config/config.service';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { KafkaController } from '../../../../common/services/kafka/kafka.controller';
import { LoginServiceReturn } from '../../../../microservices/services/auth/modules/auth/service/auth.service';
import { AUTH_FUNCTIONS } from '../../../../microservices/services/auth/container/TYPES.di';

@injectable()
export class AuthController extends BaseController {
	constructor(
		@inject(WEB_TYPES.services.kafkaController)
		private readonly kafkaController: KafkaController,
		@inject(WEB_TYPES.services.config)
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

	login = async (req: Request, res: Response<UserProfile>) => {
		console.log('[REQUEST]: LOGIN');
		const userDTO = ZodValidateSchema(LoginDTOZodSchema, req.body);
		const { payload, profile } =
			await this.kafkaController.sendAndWait<LoginServiceReturn>({
				func: AUTH_FUNCTIONS.login,
				message: userDTO,
			});

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
		console.log('[REQUEST]: LOGOUT');
		req.session.destroy(err => {
			if (err) console.error(err);
			res.clearCookie(this.configService.getEnv('COOKIE_NAME')).sendStatus(204);
		});
	};

	init = async (req: Request, res: Response<UserProfile>) => {
		console.log('[REQUEST]: INIT');
		if (!req.session.payload) {
			res.sendStatus(204);
			return;
		}
		const id = req.session.payload.id;
		// const profile = await this.authService.getProfileById(id);c
		const profile = await this.kafkaController.sendAndWait<Profile>({
			func: AUTH_FUNCTIONS.getProfileById,
			message: id,
		});
		res.json(profile);
	};
}
