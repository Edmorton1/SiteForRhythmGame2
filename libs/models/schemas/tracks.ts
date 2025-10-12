import z, { ZodType } from 'zod';
import { zId, zIntNum, zISOString } from '../enums/zod';
import { zLanguageCode } from '../enums/countries';

export const difficultiesTracks = ['easy', 'normal', 'hard'] as const;
const difficultiesZodSchema = z.enum(difficultiesTracks);
export type Difficulties = z.infer<typeof difficultiesZodSchema>;

// prettier-ignore
export const tracksSort = [
	'popularity', 'plays_count', 'likes_count', 
	'downloads_count', 'bpm', 'difficulty',
	'today', 'week', 'month', 'year'
] as const;
const TracksSortZodSchema = z.enum(tracksSort);
// export type TracksSort = z.infer<typeof TracksSortZodSchema>;

// const saveRow = (schema: ZodType) =>
// 	z.preprocess(val => {
// 		const parsed = schema.safeParse(val);
// 		return parsed.success ? parsed.data : undefined;
// 	}, schema.optional());

export const TracksQueryParamsZodSchema = z.object({
	sort: TracksSortZodSchema,
	difficulty: z.union([
		difficultiesZodSchema.transform(difficulty => [difficulty]),
		z.array(difficultiesZodSchema),
	]),
	cursor: z.object({
		id: zId,
		popularity: zIntNum,
		row: z.union([zIntNum, difficultiesZodSchema, zISOString, z.undefined()]),
		// row: zId.optional(),
	}),
	lang: z.union([
		zLanguageCode.transform(lang => [lang]),
		z.array(zLanguageCode),
	]),
});

export type TracksCursor = z.infer<
	typeof TracksQueryParamsZodSchema.shape.cursor
>;
export type TracksQueryParams = z.infer<typeof TracksQueryParamsZodSchema>;

// TODO: Если у пользователя интерфейс выбран на языке, и трек на таком же языке, то название главное показывать на нём, если нет то на английском
export const TrackZodSchema = z.object({
	id: zId,
	name_en: z.string().max(32),
	name: z.string().max(32),
	author: zId,
	performer: z.string().max(128),
	// about: z.string().max(512).default(''),
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

export const TracksDtoZodSchema = TrackZodSchema.omit({
	id: true,
	likes_count: true,
	downloads_count: true,
	plays_count: true,
	created_at: true,
	is_deleted: true,
});
export type TrackDTO = z.infer<typeof TracksDtoZodSchema>;

export type AllTracksServerReturn = {
	tracks: Track[];
	cursor: TracksCursor;
};
