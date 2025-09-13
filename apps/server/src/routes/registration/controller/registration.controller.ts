import { RegistrationDTOZodSchema } from '../../../common/models/schemas/registration.dto';
import { RegistrationService } from '../service/registration.service';
import { zodValidateFormData } from '../../../common/pipes/zod.formdata.pipe';
import { Request, Response } from 'express';
import { BaseController } from '../../../config/base.controller';
import { serverPaths } from '../../../../../../libs/shared/PATHS';
import multer from 'multer';
import { inject, injectable } from 'inversify';
import { TYPES } from '../../../containers/TYPES';

@injectable()
export class RegistrationController extends BaseController {
	constructor(
		@inject(TYPES.modules.registration.service)
		private readonly registrationService: RegistrationService,
		// @inject(TYPES.services.config)
		// private readonly configService: ConfigService,
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

		const profile = await this.registrationService.registration(
			authDTO,
			provider,
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
