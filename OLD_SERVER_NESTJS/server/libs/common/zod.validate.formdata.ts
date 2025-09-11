import { BadRequestException } from '@nestjs/common';
import { ZodError, ZodType } from 'zod';

interface args {
	data: unknown;
	name: string;
	schema: ZodType;
	files?: Record<string, Express.Multer.File | Express.Multer.File[]>;
}

export function zodValidateFormData({ data, name, schema, files: file }: args) {
	console.log(data);
	if (typeof data !== 'object' || data === null || !(name in data)) {
		throw new BadRequestException(
			`The passed FormData has no property ${name}`,
		);
	}

	try {
		const json = JSON.parse((data as any)[name]);
		console.log({ ...json, ...file });
		const parsed = schema.parse({ ...json, ...file });
		return parsed;
	} catch (err) {
		if (err instanceof ZodError) {
			throw new BadRequestException(JSON.parse(err.message));
		}
		throw new BadRequestException(
			`The passed FormData with the property ${name} is not JSON`,
		);
	}
}
