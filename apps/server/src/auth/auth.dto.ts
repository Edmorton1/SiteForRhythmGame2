import {
	UserDTO,
	UserDTOZodSchema,
} from "@libs/types/common/database.types.dto";
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
	public email: string;
	@ApiProperty()
	public password: string;
}
