import { ContainerModule } from 'inversify';
import { TYPES } from '../TYPES';
import { RegistrationController } from '../../routes/registration/controller/registration.controller';
import { RegistrationService } from '../../routes/registration/service/registration.service';
import { RegistrationRepository } from '../../routes/registration/repository/registration.repository';

export const registrationBindings = new ContainerModule(({ bind }) => {
	bind<RegistrationController>(TYPES.modules.registration.controller)
		.to(RegistrationController)
		.inSingletonScope();
	bind<RegistrationService>(TYPES.modules.registration.service)
		.to(RegistrationService)
		.inSingletonScope();
	bind<RegistrationRepository>(TYPES.modules.registration.repository)
		.to(RegistrationRepository)
		.inSingletonScope();
});
