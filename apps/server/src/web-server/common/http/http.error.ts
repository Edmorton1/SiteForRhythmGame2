// TODO: Написать похожую ошибку для микросервисов, чтобы веб-сервер понимал

export class HttpError {
	constructor(
		public statusCode: number,
		public message?: any,
	) {}
}
