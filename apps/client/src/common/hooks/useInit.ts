import { useQuery } from "@tanstack/react-query";
import { taipan } from "../taipan/taipan";
import { serverPaths } from "../../../../../libs/shared/PATHS";
// prettier-ignore
import { UserProfileZodSchemaClient, type UserProfile } from "../../../../../libs/models/schemas/profile";
import { PROFILE } from "../consts/QUERY_KEYS";

const getInit = async () => {
	const res = await taipan<UserProfile>(_URL_SERVER + serverPaths.init, {
		// schema: UserProfileZodSchemaClient,
	});

	console.log("[INIT]", res.data);
	return res.data;
};

export const useInit = () =>
	useQuery({
		queryKey: [PROFILE],
		queryFn: getInit,
		staleTime: Infinity,
	});
