import { registrationBindings } from '../containers/modules/registration.di';
import { authBindings } from '../containers/modules/auth.di';
import { googleBindings } from '../containers/modules/google.di';
import { AUTH_TYPES } from './TYPES.di';
import { createContainer } from '../../../containers/createContianer';

export const authContainer = createContainer(AUTH_TYPES.modules);
authContainer.load(registrationBindings);
authContainer.load(authBindings);
authContainer.load(googleBindings);
