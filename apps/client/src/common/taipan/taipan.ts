import type { z, ZodType } from "zod";

type FetchParams = Parameters<typeof fetch>;
type FetchReturn = Awaited<ReturnType<typeof fetch>>;
type FetchReturnExtended<T> = Omit<FetchReturn, "json"> & {
	data: T;
};

// TODO: ДОБАВИТЬ ПАРС JSON ЕСЛИ НЕ УКАЗАНО

export const taipan = async <T = unknown>(
	url: FetchParams[0],
	options?: FetchParams[1] & { schema?: T extends ZodType ? T : undefined },
): Promise<
	T extends ZodType ? FetchReturnExtended<z.infer<T>> : FetchReturnExtended<T>
> => {
	console.log("ТАЙПАН");
	const res = await fetch(url, options).catch(err => {
		console.error(err);
		throw new Error(err);
	});
	console.log("RES", res);
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
		: FetchReturnExtended<T> = { ...res, data };

	if ("json" in ext) {
		delete ext.json;
	}

	return ext;
};
