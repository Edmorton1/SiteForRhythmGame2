import z from "zod";

export const zid = z.number().int();
export const zISOString = z.coerce.date().transform(d => d.toISOString());
