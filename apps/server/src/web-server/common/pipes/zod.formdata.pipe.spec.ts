import z from 'zod';
import { zodValidateFormData } from './zod.formdata.pipe';
import { HttpError } from '../../../common/http/http.error';
import { zExpressMulterFile } from '../../../common/models/enums/enums';
import { Readable } from 'stream';

const mockFile: Express.Multer.File = {
	fieldname: 'avatar',
	originalname: 'avatar.png',
	encoding: '7bit',
	mimetype: 'image/png',
	size: 12345,
	destination: '/tmp',
	filename: 'avatar-123.png',
	path: '/tmp/avatar-123.png',
	buffer: Buffer.from('fake content'),
	stream: Readable.from(Buffer.from('fake content')),
};

describe('[PIPES] Zod Form Data', () => {
	const validData = {
		data: { data: JSON.stringify({ foo: 'foo', bar: 123 }) },
		schema: z.object({
			foo: z.string(),
			bar: z.number(),
		}),
	};

	it('Valid data', () => {
		expect(
			zodValidateFormData({
				data: validData.data,
				name: 'data',
				schema: validData.schema.extend({ avatar: zExpressMulterFile }),
				files: { avatar: mockFile },
			}),
		).toEqual({ foo: 'foo', bar: 123, avatar: mockFile });
	});

	it('Not found name', () => {
		expect(() =>
			zodValidateFormData({
				data: validData.data,
				name: 'none',
				schema: validData.schema,
			}),
		).toThrow(HttpError);
	});

	it('Not valid JSON', () => {
		expect(() =>
			zodValidateFormData({
				data: { foo: 'bar' },
				name: 'foo',
				schema: z.object({ foo: z.string() }),
			}),
		).toThrow(HttpError);
	});

	it('Not valid data(ZodError)', () => {
		expect(() =>
			zodValidateFormData({
				data: validData.data,
				name: 'data',
				schema: z.object({ any: z.string() }),
			}),
		).toThrow(HttpError);
	});
});
