import '@asteasolutions/zod-to-openapi';
import { z } from 'zod';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { registry } from '../../config/swagger/registry';
import { serverPaths } from '../../../../../../libs/common/PATHS';
import { SERVER_PREFIX } from '../../../../../../libs/common/CONST';
import { UserProfileZodSchemaClient } from '../../../../../../libs/models/schemas/profile';
import { LoginDTOZodSchema } from '../../../../../../libs/models/schemas/auth';
import { authErrors } from '../../../common/modules/auth/errors/auth';
import { docsErrors } from '../../common/errors/docs.errors';

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
		default: docsErrors.default,
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
		...docsErrors.UNAUTHORIZED_ERROR,
	},
});
