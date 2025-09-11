import { useQuery } from "@tanstack/react-query";
import { serverPaths } from "../../../../../libs/shared/PATHS";
// prettier-ignore
import { UserProfileZodSchemaClient } from "../../../../../libs/models/schemas/profile";
import { PROFILE } from "../consts/QUERY_KEYS";
import axios from "axios";

const getInit = async () =>
	axios
		.get(_URL_SERVER + serverPaths.init)
		// .then(({ data }) => data)
		.then(({ data }) => UserProfileZodSchemaClient.parse(data))
		.catch(err => {
			console.error(err);
			return null;
		});

export const useInit = () =>
	useQuery({
		queryKey: [PROFILE],
		queryFn: getInit,
		staleTime: Infinity,
	});
