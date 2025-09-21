import z, { ZodType } from 'zod';
import { HttpError } from '../../../common/http/http.error';

export const ZodValidateSchema = <T extends ZodType>(
	schema: T,
	value: unknown,
): z.infer<T> => {
	const parsed = schema.safeParse(value);
	if (!parsed.success) {
		throw new HttpError(400, parsed.error);
	}
	return parsed.data;
};
