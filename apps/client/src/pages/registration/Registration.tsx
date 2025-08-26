import { RegistrationAuthModule } from "./modules/user/User";
import { RegistrationProfileModule } from "./modules/profile/Profile";
import { useRegistrationAuthStore } from "./common/stores/user.store";
import { useSearchParams } from "react-router-dom";

// TODO: Будет в 2 этапа. Сначала вводится авторизация данные, потом пользователя, они должны хранится между перезагрузкой страницы
export default function Registration() {
	const { user } = useRegistrationAuthStore();
	const [searchParams] = useSearchParams();
	const isOauth = searchParams.get("oauth") === "true";

	if ((user.email && user.password) || isOauth) {
		return <RegistrationProfileModule />;
	}

	return <RegistrationAuthModule />;
}
