import { Link } from "react-router-dom";
import { clientPaths } from "../common/consts/PATHS";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../common/consts/NAMESPACES";
import { useInit } from "../common/hooks/useInit";

export const Header = () => {
	const { t, i18n } = useTranslation(NAMESPACES.base);

	const changeLang = (lang: string) => {
		i18n.changeLanguage(lang);
	};

	const { data } = useInit();

	return (
		<header style={{ display: "flex", gap: "15px" }}>
			<nav style={{ display: "flex", gap: "15px" }}>
				<Link to={clientPaths.home}>{t("nav.home")}</Link>
				<Link to={clientPaths.registration}>{t("nav.registration")}</Link>
				<Link to={clientPaths.login}>{t("nav.login")}</Link>
			</nav>
			<div>Пользователь: {data ? data.name : "asd"}</div>
			<select
				name="lang"
				onChange={event => changeLang(event.target.value)}>
				<option value="en">English</option>
				<option value="ru">Русский</option>
			</select>
		</header>
	);
};
