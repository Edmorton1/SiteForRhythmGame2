import z from 'zod';

export const zExpressMulterFile = z.custom<Express.Multer.File>();
