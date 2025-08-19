"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserZodSchema = void 0;
var zod_1 = require("zod");
var rolesZodSchema = zod_1.z.enum(["user", "admin"]);
exports.UserZodSchema = zod_1.z.object({
	id: zod_1.z.number().int(),
	role: rolesZodSchema,
	email: zod_1.z.email().max(256).nullable(),
	provider_id: zod_1.z.string().max(21).nullable(),
	password: zod_1.z.string().max(128).nullable(),
	banned: zod_1.z.boolean().default(false),
});
