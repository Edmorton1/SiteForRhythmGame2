// prettier-ignore
import { UserDTO, UserDTOZodSchema } from "../../../../libs/types/database.types.dto";
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
