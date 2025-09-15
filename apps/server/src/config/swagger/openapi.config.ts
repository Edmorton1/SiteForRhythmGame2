import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';
import '../../services/auth/modules/registration/registration.docs';
import '../../services/auth/modules/auth/auth.docs';
import '../../services/auth/modules/google/google.docs';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openapiDocs = generator.generateDocument({
	openapi: '3.0.0',
	info: {
		title: 'Rhythm Game',
		description: 'Rhythm Game web API',
		version: '1.0',
	},
});
