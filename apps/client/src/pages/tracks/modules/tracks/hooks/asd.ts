import { serverPaths } from '../../../../../../../../libs/common/PATHS';
import z from 'zod';

const QueryParamsZodSchema = z
	.object({})
	.catchall(
		z.union([z.string(), z.array(z.string()), z.undefined(), z.number()]),
	);

type QueryParams = z.infer<typeof QueryParamsZodSchema>;

type QueryParamsEntry = QueryParams[keyof QueryParams];

type QueryParamsEntries = [string, QueryParamsEntry][];

interface Options {
	schema: z.ZodType<QueryParams>;
	params: URLSearchParams;
	url: string;
}

export class Asd {
	objValidated: QueryParams;

	constructor(private readonly options: Options) {
		this.objValidated = this.validateSearchParams();
	}

	private validateSearchParams = (): QueryParams => {
		const objParams = Object.fromEntries(
			this.options.params.entries().map(([key, value]) => {
				const allParams = this.options.params.getAll(key);
				if (allParams.length > 1) {
					return [key, allParams];
				}
				return [key, value];
			}),
		);
		console.log('PARAMS SERVER', objParams);
		// !: МОЖЕТ НЕ ЛОГИРОВАТЬ ОШИБКУ
		return this.options.schema.parse(objParams);
	};

	objectToSortedArray = (): QueryParamsEntries => {
		return Array.from(Object.entries(this.objValidated))
			.map(([key, value]): QueryParamsEntry => {
				if (Array.isArray(value)) {
					return [key, value.sort((a, b) => a.localeCompare(b))];
				}
				return [key, value];
			})
			.sort(([a], [b]) => {
				console.log('A', a, 'B', b);
				return a.localeCompare(b);
			});
	};

	private objectToSearchParams = (): URLSearchParams => {
		const searchParams = new URLSearchParams();
		Object.entries(this.objValidated).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach(arrVal => searchParams.append(key, arrVal));
			} else if (typeof value === 'string') {
				searchParams.append(key, value);
			}
		});

		return searchParams;
	};

	getURL = (): string => {
		const url = new URL(_URL_SERVER + serverPaths.tracks);
		const searchParams = this.objectToSearchParams();
		url.search = searchParams.toString();
		console.log('new HREF', url.href);
		return url.href;
	};
}

// import { serverPaths } from '../../../../../../../../libs/common/PATHS';
// import type { z, ZodType } from 'zod';

// export class asd {
// 	validateSearchParams = <T extends ZodType>(
// 		schema: T,
// 		params: URLSearchParams,
// 	): z.infer<T> => {
// 		const objParams = Object.fromEntries(
// 			params.entries().map(([key, value]) => {
// 				const allParams = params.getAll(key);
// 				if (allParams.length > 1) {
// 					return [key, allParams];
// 				}
// 				return [key, value];
// 			}),
// 		);
// 		console.log('PARAMS SERVER', objParams);
// 		// !: МОЖЕТ НЕ ЛОГИРОВАТЬ ОШИБКУ
// 		return schema.parse(objParams);
// 	};

// 	objectToSortedArray = (obj: object) => {
// 		return Array.from(Object.entries(obj))
// 			.map(([key, value]) => {
// 				if (Array.isArray(value)) {
// 					return [key, value.sort((a, b) => a.localeCompare(b))];
// 				}
// 				return [key, value];
// 			})
// 			.sort(([a], [b]) => {
// 				console.log('A', a, 'B', b);
// 				return a.localeCompare(b);
// 			});
// 	};

// 	objectToSearchParams = (obj: object): URLSearchParams => {
// 		const searchParams = new URLSearchParams();
// 		Object.entries(obj).forEach(([key, value]) => {
// 			if (Array.isArray(value)) {
// 				value.forEach(arrVal => searchParams.append(key, arrVal));
// 			} else if (typeof value === 'string') {
// 				searchParams.append(key, value);
// 			}
// 		});

// 		return searchParams;
// 	};

// 	getURL = (params: object): string => {
// 		const url = new URL(_URL_SERVER + serverPaths.tracks);
// 		const searchParams = objectToSearchParams(params);
// 		url.search = searchParams.toString();
// 		console.log('new HREF', url.href);
// 		return url.href;
// 	};
// }
