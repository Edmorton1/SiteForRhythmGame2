import { UserDTOZodSchema } from "../../../../libs/models/schemas/user";
// prettier-ignore
import { Profile, ProfileZodSchema } from "../../../../libs/models/schemas/profile";
import z from "zod";

const ProfileDTOZodSchema = ProfileZodSchema.pick({
	name: true,
	about: true,
	country_code: true,
}).extend({
	avatar: z.file().optional(),
});

// Завтра переименовать на сервере Auth в Users
export const AuthDTOZodSchema = z.object({
	auth: UserDTOZodSchema,
	profile: ProfileDTOZodSchema,
});

export type AuthDTO = z.infer<typeof AuthDTOZodSchema>;
// export class UserDTOValidation
// 	extends createZodDto(AuthDTOZodSchema)
// 	implements AuthDTO
// {
// 	auth: {
// 		email: string;
// 		password: string;
// 	};
// 	profile: {
// 		name: string;
// 		about: string;
// 		country_code: string;
// 		avatar?: File;
// 	};
// }

export interface LoginResponse {
	token: string;
	profile: Profile;
}

// TODO: Когда дописать документацию - удалить комментарии

// export class UserDTOSwagger implements AuthDTO {
// 	@ApiProperty({
// 		type: "object",
// 		properties: {
// 			email: { type: "string" },
// 			password: { type: "string" },
// 		},
// 	})
// 	auth: {
// 		email: string;
// 		password: string;
// 	};
// 	@ApiProperty({
// 		type: "object",
// 		properties: {
// 			name: { type: "string" },
// 			about: { type: "string" },
// 			country_code: { type: "string" },
// 			// TODO: Fix as file
// 			avatar: { type: "string", format: "binary", required: false },
// 		},
// 	})
// 	profile: {
// 		name: string;
// 		about: string;
// 		country_code: string;
// 		avatar?: File;
// 	};
// }
