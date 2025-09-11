import { useQuery } from "@tanstack/react-query";
import axios from "axios";

interface Country {
	name: string;
	code: number;
}

const getCountries = async () =>
	axios.get<Country[]>("/data/countries.json").then(({ data }) => data);

export const useCountries = () => {
	const result = useQuery({
		queryKey: ["countries"],
		queryFn: getCountries,
		retry: false,
	});

	return result;
};
