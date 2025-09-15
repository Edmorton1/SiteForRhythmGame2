import '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../../../../config/swagger/registry';
import { SERVER_PREFIX } from '../../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { RegistrationDTOZodSchema } from '../../../../common/models/schemas/registration.dto';
import { ProfileZodSchema } from '../../../../../../../libs/models/schemas/profile';
import { registrationErrors } from './errors/CONST';
import { commonErrors } from '../../../../common/errors/CONST';

extendZodWithOpenApi(z);
// TODO: Add errors variables
registry.registerPath({
	method: 'post',
	path: SERVER_PREFIX + serverPaths.registration,
	request: {
		body: {
			required: true,
			description:
				'WARNING!!! Send in form-data, key data as JSON, avatar as Image',
			content: {
				'application/json': {
					schema: z.object({
						data: RegistrationDTOZodSchema.omit({ avatar: true }),
						avatar: z.string().openapi({ example: 'file/img' }),
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: 'Returns profile',
			content: {
				'application/json': {
					schema: ProfileZodSchema,
				},
			},
		},
		400: {
			description: `
	${registrationErrors.AUTH_METHOD}
	${commonErrors.ZOD_FORMDATA_NOT_JSON('data')}
	${commonErrors.ZOD_FORMDATA_NO_PROPERTY('data')}
	${commonErrors.DOCS_VALIDATION_ERROR}`,
		},
		409: {
			description: `
	${registrationErrors.EMAIL_TAKEN}
	${registrationErrors.NICKNAME_TAKEN}`,
		},
		//@ts-ignore
		default: commonErrors.default,
	},
});
