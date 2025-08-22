import { useQuery } from "@tanstack/react-query";

interface Country {
	name: string;
	code: number;
}

const getCountries = () =>
	fetch("/data/countries.json")
		.then(response => response.json())
		.catch(() => {
			throw new Error("Failed to load file countries.json");
		});

export function useCountries() {
	const result = useQuery<Country[]>({
		queryKey: ["countries"],
		queryFn: getCountries,
		retry: false,
	});

	return result;
}
