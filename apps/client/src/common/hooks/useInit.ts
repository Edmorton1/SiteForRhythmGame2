import { useQuery } from "@tanstack/react-query";
import { serverPaths } from "../../../../../libs/shared/PATHS";
import { PROFILE } from "../consts/QUERY_KEYS";
import { taipan } from "../taipan/taipan";
import { UserProfileZodSchemaClient } from "../../../../../libs/models/schemas/profile";

const getInit = async () => {
	const response = await taipan(serverPaths.init, {
		schema: UserProfileZodSchemaClient,
	});

	return response.data;
};

export const useInit = () => {
	const result = useQuery({
		queryKey: [PROFILE],
		queryFn: getInit,
	});

	return result;
};
