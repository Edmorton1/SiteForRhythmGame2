import { AuthService } from './auth.service';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { serverPaths } from '../../../../../libs/shared/PATHS';
import type {
	AuthDTO,
	LoginResponse,
} from '../../../libs/models/schemas/auth.dto';

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@MessagePattern(serverPaths.registration)
	async registration(@Payload() authDTO: AuthDTO): Promise<LoginResponse> {
		return this.authService.registration(authDTO);
	}

	// @MessagePattern(serverPaths.login)
	// async login(userDto: UserDTOValidation): Promise<string> {
	// 	return this.authService.login(userDto);
	// }
}
