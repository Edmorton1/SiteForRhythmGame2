import { createMicroServer } from '../../config/createServer';
import { authMicroContainer } from './container/container.di';

createMicroServer(authMicroContainer);
