import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../../common/const/NAMESPACES";
import { useRegistrationStore } from "./store";

// Будет в 2 этапа. Сначала вводится авторизация данные, потом пользователя, они должны хранится между перезагрузкой страницы
function Registration() {
	const { t } = useTranslation(NAMESPACES.registration);
	const { users, addUser } = useRegistrationStore();

	return (
		<>
			<form>
				<label htmlFor="email">{t("form.email")}</label>
				<input
					type="text"
					id="email"
				/>
				<label htmlFor="password">{t("form.password")}</label>
				<input
					type="password"
					id="password"
				/>
				<button>{t("form.submit")}</button>
			</form>
			<button onClick={() => addUser("asdsad")}>Добавить</button>
			<button onClick={() => console.log(users)}>Логнуть</button>
			<button>{t("loginUsing", { provider: "Google" })}</button>
			<button>{t("loginUsing", { provider: "Facebook" })}</button>
			<button>{t("loginUsing", { provider: "Twitter" })}</button>
		</>
	);
}

export default Registration;
