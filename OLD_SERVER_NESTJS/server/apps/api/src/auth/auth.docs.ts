import { z } from "zod";
import "@asteasolutions/zod-to-openapi";
import { ProfileZodSchema } from "../../../../../../libs/models/schemas/profile";
import { serverPaths } from "../../../../../../libs/shared/PATHS";
import { AuthDTOZodSchema } from "../../../../libs/models/schemas/auth.dto";
import { registry } from "../registry";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { SERVER_PREFIX } from "../../../../../../libs/shared/CONST";

extendZodWithOpenApi(z);

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
						data: AuthDTOZodSchema.omit({ avatar: true }),
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
