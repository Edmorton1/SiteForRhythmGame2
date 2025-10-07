import { ZodError, ZodType } from 'zod';
import { HttpError } from '../../../common/http/http.error';
import { docsErrors } from '../errors/docs.errors';

interface Args<T extends ZodType<any>> {
	data: unknown;
	name: string;
	schema: T;
	files?: Record<
		string,
		Express.Multer.File | Express.Multer.File[] | undefined
	>;
}

export const zodValidateFormData = <T extends ZodType<any>>({
	data,
	name,
	schema,
	files: file,
}: Args<T>) => {
	if (typeof data !== 'object' || data === null || !(name in data)) {
		throw new HttpError(400, docsErrors.ZOD_FORMDATA_NO_PROPERTY(name));
	}

	try {
		const json = JSON.parse((data as any)[name]);
		const parsed = schema.parse({ ...json, ...file });
		return parsed;
	} catch (err) {
		if (err instanceof ZodError) {
			throw new HttpError(400, JSON.parse(err.message));
		}
		throw new HttpError(400, docsErrors.ZOD_FORMDATA_NOT_JSON(name));
	}
};
