import { serviceBindings } from '../../../containers/services.di';
import { tracksBindings } from './modules/tracks.di';
import { Container } from 'inversify';

// Задачи на завтра: Минимизировать рутину при создании микросервиса, нормально их разъединить, чтоб на разных портах хотя-бы работали
// Сделать Api-Gateway вместе с Kafka

export const tracksContainer = new Container();
tracksContainer.load(serviceBindings);
tracksContainer.load(tracksBindings);
