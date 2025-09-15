import { ContainerModule } from 'inversify';
import { AUTH_TYPES } from '../TYPES.di';
import { RegistrationController } from '../../../../routes/registration/controller/registration.controller';
import { RegistrationService } from '../../../../routes/registration/service/registration.service';
import { RegistrationRepository } from '../../../../routes/registration/repository/registration.repository';

export const registrationBindings = new ContainerModule(({ bind }) => {
	bind<RegistrationController>(AUTH_TYPES.modules.registration.controller)
		.to(RegistrationController)
		.inSingletonScope();
	bind<RegistrationService>(AUTH_TYPES.modules.registration.service)
		.to(RegistrationService)
		.inSingletonScope();
	bind<RegistrationRepository>(AUTH_TYPES.modules.registration.repository)
		.to(RegistrationRepository)
		.inSingletonScope();
});
