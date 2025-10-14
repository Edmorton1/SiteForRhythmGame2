import z, { ZodType } from 'zod';

export const zId = z.coerce.number().int().positive();
export const zIntNum = z.coerce.number().int();
export const zISOString = z.coerce.date().transform(d => d.toISOString());
export const toArrayPreprocess = <T extends ZodType>(schema: T) =>
	z.preprocess(val => {
		if (Array.isArray(val)) return val;
		return [val];
	}, z.array(schema));
