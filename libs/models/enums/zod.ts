import z from 'zod';

export const zId = z.coerce.number().int().positive();
export const zIntNum = z.coerce.number().int();
export const zISOString = z.coerce.date().transform(d => d.toISOString());
