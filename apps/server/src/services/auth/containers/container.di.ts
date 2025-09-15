import { Container } from 'inversify';
import { serviceBindings } from '../../../containers/services.di';
import { registrationBindings } from '../containers/modules/registration.di';
import { authBindings } from '../containers/modules/auth.di';
import { googleBindings } from '../containers/modules/google.di';
import { appBindings } from '../../../containers/app.di';
import { MODULE, Module } from '../../../containers/modules.di';
import { AUTH_TYPES } from './TYPES.di';

export const authContainer = new Container();
authContainer.bind<Module>(MODULE).toConstantValue(AUTH_TYPES.modules);
authContainer.load(serviceBindings);
authContainer.load(registrationBindings);
authContainer.load(authBindings);
authContainer.load(googleBindings);
authContainer.load(appBindings);
