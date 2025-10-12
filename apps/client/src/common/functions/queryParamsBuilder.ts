import { serverPaths } from '../../../../../libs/common/PATHS';
import z from 'zod';
import type { TracksCursor } from '../../../../../libs/models/schemas/tracks';

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

export class QueryParamsBuilder {
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
		return this.options.schema.parse(objParams);
	};

	getSortedParams = (): QueryParamsEntries => {
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

	private objectToSearchParams = (cursor?: TracksCursor): URLSearchParams => {
		const searchParams = new URLSearchParams();
		// TODO: Сделать чтобы курсор валидировался перед отправкой
		if (cursor) {
			searchParams.set('cursor', JSON.stringify(cursor));
		}
		Object.entries(this.objValidated).forEach(([key, value]) => {
			if (Array.isArray(value)) {
				value.forEach(arrVal => searchParams.append(key, arrVal));
			} else if (typeof value === 'string') {
				searchParams.append(key, value);
			}
		});

		return searchParams;
	};

	// TODO: Хардкод, убрать
	getURL = (cursor?: TracksCursor): string => {
		const url = new URL(_URL_SERVER + serverPaths.tracks);
		const searchParams = this.objectToSearchParams(cursor);
		url.search = searchParams.toString();
		console.log('new HREF', url.href);
		return url.href;
	};
}
