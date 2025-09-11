import type { z, ZodType } from "zod";

type FetchParams = Parameters<typeof fetch>;
type FetchReturn = Awaited<ReturnType<typeof fetch>>;
type FetchReturnExtended<T> = Omit<FetchReturn, "json"> & {
	data: T;
};
type Options<T> = FetchParams[1] & {
	schema?: T extends ZodType ? T : undefined;
};

export const taipan = async <T = unknown>(
	url: FetchParams[0],
	options?: Options<T>,
): Promise<
	T extends ZodType ? FetchReturnExtended<z.infer<T>> : FetchReturnExtended<T>
> => {
	// BEFORE REQUEST
	const res = await fetch(url, options).catch(err => {
		console.error(err);
		throw new Error(err);
	});

	await isResOk(res);
	// AFTER REQUEST

	const data = await parseData(res, options?.schema);

	const ext: T extends ZodType
		? FetchReturnExtended<z.infer<T>>
		: FetchReturnExtended<T> = { ...res, data };

	if ("json" in ext) {
		delete ext.json;
	}

	return ext;
};

async function isResOk(res: FetchReturn) {
	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`[TAIPAN] HTTP ${res.status} ${res.statusText} ${errText}`);
	}
}

async function parseData(res: FetchReturn, schema: ZodType | undefined) {
	const data = await res.json();
	if (schema) {
		return schema.parse(data);
	}
	return data;
}
