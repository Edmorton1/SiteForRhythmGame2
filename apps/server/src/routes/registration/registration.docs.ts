import "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { serverPaths } from "../../../../../libs/shared/PATHS";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { ProfileZodSchema } from "../../../../../libs/models/schemas/profile";
import { registry } from "../../config/swagger/registry";
import { SERVER_PREFIX } from "../../../../../libs/shared/CONST";
import { RegistrationDTOZodSchema } from "../../common/models/schemas/registration.dto";

extendZodWithOpenApi(z);
// TODO: Add errors variables
registry.registerPath({
	method: "post",
	path: SERVER_PREFIX + serverPaths.registration,
	request: {
		body: {
			required: true,
			description:
				"WARNING!!! Send in form-data, key data as JSON, avatar as Image",
			content: {
				"application/json": {
					schema: z.object({
						data: RegistrationDTOZodSchema.omit({ avatar: true }),
						avatar: z.string().openapi({ example: "file/img" }),
					}),
				},
			},
		},
	},
	responses: {
		201: {
			description: "Returns profile",
			content: {
				"application/json": {
					schema: ProfileZodSchema,
				},
			},
		},
	},
});
