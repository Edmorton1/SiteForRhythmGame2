import { Request, Response } from 'express';
import multer from 'multer';
import { inject, injectable } from 'inversify';
import { BaseController } from '../../../config/controllers/base.controller';
import { serverPaths } from '../../../../../../../libs/common/PATHS';
import { zodValidateFormData } from '../../../common/pipes/zod.formdata.pipe';
import { RegistrationDTOZodSchema } from '../../../../common/models/schemas/registration.dto';
import { TOPICS } from '../../../../common/topics/TOPICS';
// prettier-ignore
import { AUTH_FUNCTIONS, AUTH_KEYS } from '../../../../common/modules/auth/auth.functions';
// prettier-ignore
import { KafkaSender, KafkaSenderReturn } from '../../../common/adapters/kafka.sender';
import { ADAPTERS } from '../../../../common/adapters/container/adapters.types';

@injectable()
export class RegistrationController extends BaseController {
	sender: KafkaSenderReturn<AUTH_FUNCTIONS>;

	constructor(
		@inject(ADAPTERS.web.kafkaSender)
		private readonly kafkaSender: KafkaSender,
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
		this.sender = this.kafkaSender.initSender<AUTH_FUNCTIONS>();
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
