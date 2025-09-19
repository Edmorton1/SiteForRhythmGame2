import '@asteasolutions/zod-to-openapi';
import { registry } from '../../../../web-server/config/swagger/registry';
import { SERVER_PREFIX } from '../../../../../../../libs/shared/CONST';
import { serverPaths } from '../../../../../../../libs/shared/PATHS';

registry.registerPath({
	method: 'get',
	path: SERVER_PREFIX + serverPaths.authGoogle,
	responses: {
		302: {
			description: 'Redirect on Google OAuth 2.0 page',
		},
	},
});

registry.registerPath({
	method: 'get',
	path: SERVER_PREFIX + serverPaths.authGoogleCallback,
	responses: {
		302: {
			description: `
	If the account is already registered, then authorization will occur and a redirect to the main page of the site.		
	If the account is not registered, a redirect to the registration page with profile creation will occur`,
		},
	},
});
