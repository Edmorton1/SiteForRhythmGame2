import '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../../../../config/swagger/registry';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';
import { SERVER_PREFIX } from '../../../../../../../libs/shared/CONST';
import { UserProfileZodSchemaClient } from '../../../../../../../libs/models/schemas/profile';
import { LoginDTOZodSchema } from '../../../../../../../libs/models/schemas/auth';
import { authErrors } from './errors/CONST';
import { commonErrors } from '../../../../common/errors/CONST';

extendZodWithOpenApi(z);

registry.registerPath({
	method: 'get',
	path: SERVER_PREFIX + serverPaths.init,
	description: 'User initialization when logging into the site',
	responses: {
		200: {
			description: 'User object',
			content: {
				'application/json': {
					schema: UserProfileZodSchemaClient,
				},
			},
		},
		204: {
			description: 'If user is not logged returning empty response',
		},
	},
});

registry.registerPath({
	method: 'post',
	path: SERVER_PREFIX + serverPaths.login,
	description: 'User login endpoint for email method',
	request: {
		body: {
			content: {
				'application/json': {
					schema: LoginDTOZodSchema,
				},
			},
		},
	},
	responses: {
		200: {
			description: 'User object',
			content: {
				'application/json': {
					schema: UserProfileZodSchemaClient,
				},
			},
		},
		404: {
			description: authErrors.NO_EMAIL,
		},
		401: {
			description: authErrors.INCORRECT_PASSWORD,
		},
		//@ts-ignore
		default: commonErrors.default,
	},
});

registry.registerPath({
	method: 'delete',
	path: SERVER_PREFIX + serverPaths.logout,
	description: 'User logout',
	responses: {
		204: {
			description: 'empty',
		},
		...commonErrors.UNAUTHORIZED_ERROR,
	},
});
