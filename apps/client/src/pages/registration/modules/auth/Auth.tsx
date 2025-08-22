import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserDTOZodSchema } from "../../../../../../../libs/models/schemas/user";
import { NAMESPACES } from "../../../../common/const/NAMESPACES";
import { useRegistrationAuthStore } from "../../common/stores/auth.store";

export function RegistrationAuthModule() {
	const { t } = useTranslation(NAMESPACES.registration);
	const { setUser: setEmailPassword } = useRegistrationAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(UserDTOZodSchema) });

	console.log(errors);

	const onSubmit = handleSubmit(data => setEmailPassword(data));

	return (
		<>
			<form onSubmit={onSubmit}>
				<label htmlFor="email">{t("form.email")}</label>
				<input
					{...register("email")}
					type="text"
					id="email"
				/>

				<label htmlFor="password">{t("form.password")}</label>
				<input
					{...register("password")}
					type="password"
					id="password"
				/>

				<button>{t("form.submit")}</button>
			</form>
			{/* TODO: Authorization with providers */}
			{/* <button onClick={() => addUser("asdsad")}>Добавить</button>
      <button onClick={() => console.log(users)}>Логнуть</button>
      <button>{t("loginUsing", { provider: "Google" })}</button>
      <button>{t("loginUsing", { provider: "Facebook" })}</button>
      <button>{t("loginUsing", { provider: "Twitter" })}</button> */}
		</>
	);
}
