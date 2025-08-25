import { RegistrationAuthModule } from "./modules/user/User";
import { RegistrationProfileModule } from "./modules/profile/Profile";
import { useRegistrationAuthStore } from "./common/stores/user.store";

export default function Registration() {
	const { user } = useRegistrationAuthStore();

	if (user) {
		return <RegistrationProfileModule />;
	}

	return <RegistrationAuthModule />;
}
