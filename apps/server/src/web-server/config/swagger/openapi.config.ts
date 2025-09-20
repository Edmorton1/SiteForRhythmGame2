import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { registry } from './registry';
import '../../modules/registration/registration.docs';
import '../../modules/auth/auth.docs';
import '../../modules/google/google.docs';

const generator = new OpenApiGeneratorV3(registry.definitions);

export const openapiDocs = generator.generateDocument({
	openapi: '3.0.0',
	info: {
		title: 'Rhythm Game',
		description: 'Rhythm Game web API',
		version: '1.0',
	},
});
