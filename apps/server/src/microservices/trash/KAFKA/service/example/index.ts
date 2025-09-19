import { createMicroServer } from '../../../../config/createServer';
import { trackMicroContainer } from './containers/container.di';
import { TRACKS_MICRO_TYPES } from './containers/TYPES.di';

createMicroServer(trackMicroContainer, TRACKS_MICRO_TYPES);
