"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTOZodSchema = void 0;
var database_types_1 = require("./database.types");
exports.UserDTOZodSchema = database_types_1.UserZodSchema.pick({
	email: true,
	password: true,
});
