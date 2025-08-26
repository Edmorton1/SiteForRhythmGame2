export class HttpError {
	constructor(
		public statusCode: number,
		public message?: any,
	) {}
}
