import i18next from "i18next";
import I18nextBrowserLanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import Backend from "i18next-http-backend";
import { NAMESPACES } from "../common/const/NAMESPACES";

i18next
	.use(Backend)
	.use(I18nextBrowserLanguageDetector)
	.use(initReactI18next)
	.init({
		fallbackLng: "en",
		ns: [NAMESPACES.base],
		backend: {
			loadPath: "/locales/{{lng}}/{{ns}}.json",
		},
	});
