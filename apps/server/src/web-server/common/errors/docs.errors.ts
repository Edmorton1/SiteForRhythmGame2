export const docsErrors = {
	ZOD_FORMDATA_NO_PROPERTY: (name: string) =>
		`The passed FormData has no property ${name}`,
	ZOD_FORMDATA_NOT_JSON: (name: string) =>
		`The passed FormData with the property ${name} is not JSON`,
	DOCS_VALIDATION_ERROR: 'If the data is invalid, there will be a ZOD error.',
	UNAUTHORIZED_ERROR: { 401: { description: 'Unauthorized' } },
	default: {
		description: 'Error example',
		content: {
			'application/json': {
				schema: {
					type: 'object',
					properties: {
						status: { type: 'number', example: 500 },
						message: { type: 'string', example: 'Internal server error' },
					},
					required: ['status', 'message'],
				},
			},
		},
	},
} as const;
