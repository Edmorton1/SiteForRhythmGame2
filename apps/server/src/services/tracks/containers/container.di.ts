import { TRACKS_TYPES } from './TYPES.di';
import { tracksBindings } from './modules/tracks.di';
import { createContainer } from '../../../web-server/container/createContianer';

// Задачи на завтра: Минимизировать рутину при создании микросервиса, нормально их разъединить, чтоб на разных портах хотя-бы работали
// Сделать Api-Gateway вместе с Kafka

export const tracksContainer = createContainer(TRACKS_TYPES.modules);
tracksContainer.load(tracksBindings);
