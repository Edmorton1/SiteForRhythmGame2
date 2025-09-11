import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ZodType } from 'zod';

@Injectable()
export class ZodPipe implements PipeTransform {
	constructor(private readonly schema: ZodType) {}

	transform(value: unknown) {
		const parsed = this.schema.safeParse(value);
		if (!parsed.success) {
			throw new BadRequestException(parsed.error);
		}
		return parsed.data;
	}
}
