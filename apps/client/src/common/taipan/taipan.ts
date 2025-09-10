import type { z, ZodType } from "zod";

type FetchParams = Parameters<typeof fetch>;
type FetchReturn = Awaited<ReturnType<typeof fetch>>;
type FetchReturnExtended<T = any> = Omit<FetchReturn, "json"> & {
	data: T;
};

export const taipan = async <T extends ZodType | undefined = undefined>(
	url: FetchParams[0],
	options?: FetchParams[1] & { schema?: T extends ZodType ? T : undefined },
): Promise<
	T extends ZodType ? FetchReturnExtended<z.infer<T>> : FetchReturnExtended
> => {
	const res = await fetch(url, options);
	if (!res.ok) {
		const errText = await res.text();
		throw new Error(`[TAIPAN] HTTP ${res.status} ${res.statusText} ${errText}`);
	}

	console.log(res);

	let data = await res.json();

	if (options?.schema) {
		data = options.schema.parse(data);
	}

	const ext: T extends ZodType
		? FetchReturnExtended<z.infer<T>>
		: FetchReturnExtended = { ...res, data };

	if ("json" in ext) {
		delete ext.json;
	}

	return ext;
};
