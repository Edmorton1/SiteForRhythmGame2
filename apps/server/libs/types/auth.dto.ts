// prettier-ignore
import { type UserDTO, UserDTOZodSchema } from "@libs/types/common/database.types.dto";
// import { SERVER_PREFIX } from "@libs/shared/CONST";
import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";

export class UserDTOValidation
	extends createZodDto(UserDTOZodSchema)
	implements UserDTO
{
	email: string;
	password: string;
}

export class UserDTOSwagger implements UserDTO {
	@ApiProperty()
	email: string;
	@ApiProperty()
	password: string;
}
