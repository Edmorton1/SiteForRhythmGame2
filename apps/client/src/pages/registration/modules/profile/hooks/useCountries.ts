import { useQuery } from "@tanstack/react-query";
import { taipan } from "../../../../../common/taipan/taipan";

interface Country {
	name: string;
	code: number;
}

const getCountries = () =>
	// fetch("/data/countries.json")
	// 	.then(response => response.json())
	// 	.catch(() => {
	// 		throw new Error("Failed to load file countries.json");
	// 	});
	taipan<Country[]>("/data/countries.json")
		.then(res => res.data)
		.catch(() => {
			throw new Error("Failed to load file countries.json");
		});

export const useCountries = () => {
	const result = useQuery({
		queryKey: ["countries"],
		queryFn: getCountries,
		retry: false,
	});

	return result;
};
