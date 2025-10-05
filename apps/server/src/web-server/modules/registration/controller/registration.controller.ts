import { Request, Response } from 'express';
import multer from 'multer';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { zodValidateFormData } from '../../../common/pipes/zod.formdata.pipe';
import { RegistrationDTOZodSchema } from '../../../../common/models/schemas/registration.dto';
import { KafkaSender, KafkaWebServer } from '../../../config/kafka.webserver';
import { WEB_TYPES } from '../../../container/TYPES.di';
import { TOPICS } from '../../../../common/topics/TOPICS';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../common/modules/auth/auth.functions';

@injectable()
export class RegistrationController extends BaseController {
	sender: KafkaSender<AUTH_FUNCTIONS>;

	constructor(
		@inject(WEB_TYPES.app.KafkaWebServer)
		private readonly kafkaWebServer: KafkaWebServer,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.registration,
				method: 'post',
				path: serverPaths.registration,
				middlewares: [multer({}).single('avatar')],
			},
		]);
		this.sender = this.kafkaWebServer.initSender<AUTH_FUNCTIONS>();
	}

	registration = async (req: Request, res: Response) => {
		console.log('[REQUEST]: REGISTRATION', req.session.provider);
		const authDTO = zodValidateFormData({
			data: req.body,
			name: 'data',
			schema: RegistrationDTOZodSchema,
			files: { avatar: req.file },
		});

		const provider = req.session.provider;
		delete req.session.provider;

		console.log('SESSION', req.session, provider);

		const profile = await this.sender.sendAndWait(
			{
				func: AUTH_KEYS.registration,
				message: { authDTO, provider },
			},
			TOPICS.requests.auth,
		);

		req.session.regenerate(err => {
			if (err) {
				console.error(err);
				res.sendStatus(500);
				return;
			}
			req.session.payload = { id: profile.id, role: 'user' };
			res.status(201).json(profile);
		});
	};
}
