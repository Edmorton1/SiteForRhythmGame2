import { useForm } from "react-hook-form";
import { useCountries } from "./hooks/useCountries";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProfileDTOZodSchema } from "./schemas/profile.dto";
import { useRegistrationAuthStore } from "../../common/stores/auth.store";

export function RegistrationProfileModule() {
	const { data, isSuccess, error, isError } = useCountries();
	const { user } = useRegistrationAuthStore();

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({ resolver: zodResolver(ProfileDTOZodSchema) });

	console.log(errors);

	const onSubmit = handleSubmit(profile => {
		console.log({ user, profile });
	});

	return (
		<form onSubmit={onSubmit}>
			<label htmlFor="name">Имя</label>
			<input
				{...register("name")}
				type="text"
				id="name"
			/>

			<label htmlFor="avatar">Аватар</label>
			<input
				{...register("avatar")}
				type="file"
				id="avatar"
			/>

			<label htmlFor="about">About</label>
			<textarea
				{...register("about")}
				id="about"></textarea>

			<label htmlFor="country">Страна</label>
			{isError && <div>ERROR: {error.message}!</div>}
			{isSuccess && (
				<select
					{...register("country_code")}
					id="country">
					<option value="">Выберите страну</option>
					{data.map(country => (
						<option
							key={country.code}
							value={country.code}>
							{country.name}
						</option>
					))}
				</select>
			)}
			<button>Готово</button>
		</form>
	);
}
