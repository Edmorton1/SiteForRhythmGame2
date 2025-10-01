import { createMicroServer } from '../../config/createServer';
import { TracksMicroContainer } from './container/container.di';

createMicroServer(TracksMicroContainer);
