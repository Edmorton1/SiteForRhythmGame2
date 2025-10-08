import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UserDTOZodSchema } from '../../../../../../../libs/models/schemas/user';
import { NAMESPACES } from '../../../../common/consts/NAMESPACES';
import { useRegistrationAuthStore } from '../../common/stores/user.store';
import { serverPaths } from '../../../../../../../libs/common/PATHS';

export const RegistrationUserModule = () => {
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
				<label htmlFor='email'>{t('form.email')}</label>
				<input
					{...register('email')}
					type='text'
					id='email'
				/>

				<label htmlFor='password'>{t('form.password')}</label>
				<input
					{...register('password')}
					type='password'
					id='password'
				/>

				<button>{t('form.submit')}</button>
			</form>
			<a href={`${_URL_SERVER + serverPaths.authGoogle}`}>Google</a>
			{/* <button onClick={handleProviderClick}>
				{t("loginUsing", { provider: "Google" })}
			</button> */}
		</>
	);
};
