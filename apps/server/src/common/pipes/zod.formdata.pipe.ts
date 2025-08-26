import { ZodError, ZodType } from "zod";
import { HttpError } from "../http/http.error";

interface args {
	data: unknown;
	name: string;
	schema: ZodType;
	files?: Record<string, Express.Multer.File | Express.Multer.File[]>;
}

export const zodValidateFormData = ({
	data,
	name,
	schema,
	files: file,
}: args) => {
	if (typeof data !== "object" || data === null || !(name in data)) {
		throw new HttpError(400, `The passed FormData has no property ${name}`);
	}

	try {
		const json = JSON.parse((data as any)[name]);
		const parsed = schema.parse({ ...json, ...file });
		return parsed;
	} catch (err) {
		if (err instanceof ZodError) {
			throw new HttpError(400, JSON.parse(err.message));
		}
		throw new HttpError(
			400,
			`The passed FormData with the property ${name} is not JSON`,
		);
	}
};
