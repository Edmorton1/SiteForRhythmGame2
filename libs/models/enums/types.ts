// TODO: Удалить, нигде не используется
export type PartialWithUndefined<T> = {
	[K in keyof T]?: T[K] | undefined;
};
