import { Container } from 'inversify';
import { serviceBindings } from '../../../containers/services.di';
import { registrationBindings } from '../containers/modules/registration.di';
import { authBindings } from '../containers/modules/auth.di';
import { googleBindings } from '../containers/modules/google.di';
import { appBindings } from '../../../containers/app.di';

export const authContainer = new Container();
authContainer.load(serviceBindings);
authContainer.load(registrationBindings);
authContainer.load(authBindings);
authContainer.load(googleBindings);
authContainer.load(appBindings);
