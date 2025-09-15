import { Container } from 'inversify';
import { MODULE, Module } from '../../../containers/modules.di';
import { TRACKS_TYPES } from './TYPES.di';
import { tracksBindings } from './modules/tracks.di';
import { rootContainer } from '../../../containers/container.di';

export const tracksContainer = new Container({ parent: rootContainer });
tracksContainer.bind<Module>(MODULE).toConstantValue(TRACKS_TYPES.modules);
tracksContainer.load(tracksBindings);
