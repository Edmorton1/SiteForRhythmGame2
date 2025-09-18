import { inject, injectable } from 'inversify';
import { TracksRepository } from '../repository/repository';
import { TRACKS_TYPES } from '../../containers/TYPES.di';
// надо чтобы был свой сервер у микросервисов, который регал бы соединения
// Сделать один консюмер,
// нужно запускать один консюмер на весь сервис, чтобы он по принимаемым сообщения отправлял их в нужное место и отвечал
// Нужно сделать один консюмер на весь API - GATEWAY, чтобы он принимал ответы
@injectable()
export class TracksService {
	constructor(
		@inject(TRACKS_TYPES.modules.tracks.repository)
		private readonly repository: TracksRepository,
	) {}

	getValue = () => {
		return { foo: 'bar' };
	};
}
