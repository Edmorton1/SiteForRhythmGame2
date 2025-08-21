import { RegistrationAuthModule } from "./modules/auth/Auth";
import { RegistrationProfileModule } from "./modules/profile/Profile";
import { useRegistrationAuthStore } from "./modules/auth/stores/auth.store";

// TODO: Будет в 2 этапа. Сначала вводится авторизация данные, потом пользователя, они должны хранится между перезагрузкой страницы
export default function Registration() {
	const { email, password } = useRegistrationAuthStore();

	if (email && password) {
		return <RegistrationProfileModule />;
	}

	return <RegistrationAuthModule />;
}
