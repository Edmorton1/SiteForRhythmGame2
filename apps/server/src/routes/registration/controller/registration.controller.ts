import { RegistrationDTOZodSchema } from "../../../common/models/schemas/registration.dto";
import { RegistrationService } from "../service/registration.service";
import { zodValidateFormData } from "../../../common/pipes/zod.formdata.pipe";
import { Request, Response } from "express";
import { BaseController } from "../../../config/base.controller";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { ConfigService } from "../../../common/services/config/config.service";
import multer from "multer";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../containers/TYPES";

@injectable()
export class RegistrationController extends BaseController {
	constructor(
		@inject(TYPES.modules.registration.service)
		private readonly registrationService: RegistrationService,
		@inject(TYPES.services.config)
		private readonly configService: ConfigService,
	) {
		super();
		this.bindRoutes([
			{
				handle: this.registration,
				method: "post",
				path: serverPaths.registration,
				middlewares: [multer({}).single("avatar")],
			},
			{
				handle: this.redirect,
				// TODO: Change on POST
				method: "get",
				path: serverPaths.redirect,
			},
		]);
	}

	registration = async (req: Request, res: Response) => {
		console.log("[REQUEST]: REGISTRATION");
		const authDTO = zodValidateFormData({
			data: req.body,
			name: "data",
			schema: RegistrationDTOZodSchema,
			files: { avatar: req.file },
		});

		const provider_id: string | undefined = req.session.provider_id;
		req.session.provider_id = undefined;
		console.log("SESSION", req.session);

		const profile = await this.registrationService.registration(
			authDTO,
			provider_id,
		);

		req.session.payload = { id: profile.id, role: "user" };

		res.status(201).json(profile);
	};

	redirect = (req: Request, res: Response) => {
		// МОК ТИПА ПРОВАЙДЕР ПЕРЕДАЛ РЕАЛЬНЫЙ OPEN_ID
		const provider_id = this.registrationService.redirect();
		req.session.provider_id = provider_id;
		res
			.status(300)
			.redirect(this.configService.getEnv("REDIRECT_URL") + "?oauth=true");
	};
}
