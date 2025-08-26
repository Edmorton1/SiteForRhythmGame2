import { ZodType } from "zod";
import { HttpError } from "../http/http.error";

export const ZodValidateSchema = (schema: ZodType, value: any) => {
	const parsed = schema.safeParse(value);
	if (!parsed.success) {
		throw new HttpError(400, parsed.error);
	}
	return parsed.data;
};
