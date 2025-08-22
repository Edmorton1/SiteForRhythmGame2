import { RegistrationAuthModule } from "./modules/auth/Auth";
import { RegistrationProfileModule } from "./modules/profile/Profile";
import { useRegistrationAuthStore } from "./common/stores/auth.store";

// TODO: Будет в 2 этапа. Сначала вводится авторизация данные, потом пользователя, они должны хранится между перезагрузкой страницы
export default function Registration() {
	const { user } = useRegistrationAuthStore();

	if (user) {
		return <RegistrationProfileModule />;
	}

	return <RegistrationAuthModule />;
}
