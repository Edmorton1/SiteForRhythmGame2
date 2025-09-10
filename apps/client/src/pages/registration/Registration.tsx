import { RegistrationUserModule } from "./modules/user/User";
import { RegistrationProfileModule } from "./modules/profile/Profile";
import { useRegistrationAuthStore } from "./common/stores/user.store";
import { useSearchParams } from "react-router-dom";

export const Registration = () => {
	const { user } = useRegistrationAuthStore();
	const [searchParams] = useSearchParams();
	const isOauth = searchParams.get("oauth") === "true";

	if ((user.email && user.password) || isOauth) {
		return <RegistrationProfileModule />;
	}

	return <RegistrationUserModule />;
};
