import { Container } from 'inversify';
import { rootMicroContainer } from '../../../config/containers/container.di';

import { tracksBindings } from './tracks.di';

export const TracksContainer = new Container({ parent: rootMicroContainer });

TracksContainer.load(tracksBindings);
