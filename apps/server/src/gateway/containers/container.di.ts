import { GATEWAY_TYPES } from './TYPES.di';
import { createContainer } from '../../containers/createContainer';
import { controllerBindings } from './controllers';

export const gatewayContainer = createContainer(GATEWAY_TYPES.modules);
gatewayContainer.load(controllerBindings);
