import z from 'zod';
import { zid, zISOString } from '../enums/zod';

export const difficultiesZodSchema = z.enum(['easy', 'normal', 'hard']);

export const TrackZodSchema = z.object({
	id: zid,
	name_en: z.string().max(32),
	name: z.string().max(32),
	author: zid,
	about: z.string().max(512).default(''),
	cover_path: z.string().nullable(),
	file_path: z.string(),
	difficulty: difficultiesZodSchema,
	bpm: z.number().int().positive(),
	lang: z.string().length(2),
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
