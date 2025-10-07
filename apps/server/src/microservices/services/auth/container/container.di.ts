import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';
import { authBindings } from './auth.di';

export const authContainer = new Container({ parent: rootMicroContainer });
authContainer.load(authBindings);
