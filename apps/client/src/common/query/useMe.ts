import { useQuery } from "@tanstack/react-query";
import { serverPaths } from "../../../../../libs/shared/PATHS";

const getRefresh = () => {
	return fetch(_URL_SERVER + serverPaths.login).then(res => res.json());
};

export function useMe() {
	return useQuery({
		queryKey: ["profile"],
		queryFn: getRefresh,
	});
}
