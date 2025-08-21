import { Link } from "react-router-dom";
import { clientPaths } from "../common/const/PATHS";
import { useTranslation } from "react-i18next";
import { NAMESPACES } from "../common/const/NAMESPACES";

export function Header() {
	const { t, i18n } = useTranslation(NAMESPACES.base);

	const changeLang = (lang: string) => {
		console.log(lang);
		i18n.changeLanguage(lang);
	};

	return (
		<header style={{ display: "flex", gap: "15px" }}>
			<nav>
				<Link to={clientPaths.home}>{t("nav.home")}</Link>
				<Link to={clientPaths.registration}>{t("nav.registration")}</Link>
			</nav>
			<select
				name="lang"
				onChange={event => changeLang(event.target.value)}>
				<option value="en">English</option>
				<option value="ru">Русский</option>
			</select>
		</header>
	);
}
