import { zLanguageCode } from '../enums/countries';
import { toArrayPreprocess, zId, zIntNum, zISOString } from '../enums/zod';
import z from 'zod';

// prettier-ignore
export const TRACKS_SORT = [
	'popularity', 'plays_count', 'likes_count', 
	'downloads_count', 'bpm', 'difficulty',
	'today', 'week', 'month', 'year'
] as const

export const DIFFICULTIES_TRACKS = ['easy', 'normal', 'hard'] as const;

export const difficultiesZodSchema = z.enum(DIFFICULTIES_TRACKS);
export type Difficulties = z.infer<typeof difficultiesZodSchema>;

const TracksSortZodSchema = z.enum(TRACKS_SORT);

export const TracksQueryParamsZodSchema = z.object({
	sort: TracksSortZodSchema.default('popularity'),
	difficulty: toArrayPreprocess(difficultiesZodSchema).optional(),
	cursor: z
		.object({
			id: zId,
			popularity: zIntNum,
			row: z.union([zIntNum, difficultiesZodSchema, zISOString, z.undefined()]),
		})
		.optional(),
	lang: z
		.union([zLanguageCode.transform(lang => [lang]), z.array(zLanguageCode)])
		.optional(),
});
export type TracksQueryParams = z.infer<typeof TracksQueryParamsZodSchema>;
export type TracksCursor = NonNullable<TracksQueryParams['cursor']>;

// TODO: Если у пользователя интерфейс выбран на языке, и трек на таком же языке, то название главное показывать на нём, если нет то на английском
export const TrackZodSchema = z.object({
	id: zId,
	name_en: z.string().max(32),
	name: z.string().max(32),
	author: zId,
	performer: z.string().max(128),
	cover_path: z.string().nullable(),
	file_path: z.string(),
	difficulty: difficultiesZodSchema,
	bpm: z.number().int().positive(),
	lang: zLanguageCode,
	likes_count: z.number().int().nonnegative().default(0),
	downloads_count: z.number().int().nonnegative().default(0),
	plays_count: z.number().int().nonnegative().default(0),
	created_at: zISOString,
	is_deleted: z.boolean().default(false),
});
export type Track = z.infer<typeof TrackZodSchema>;

export const TrackDtoZodSchema = TrackZodSchema.omit({
	id: true,
	likes_count: true,
	downloads_count: true,
	plays_count: true,
	created_at: true,
	is_deleted: true,
});
export type TrackDTO = z.infer<typeof TrackDtoZodSchema>;

export type AllTracksServerReturn = {
	tracks: Track[];
	cursor: TracksCursor;
};
