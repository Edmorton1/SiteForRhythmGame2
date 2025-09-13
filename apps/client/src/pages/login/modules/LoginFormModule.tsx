import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { LogoutButton } from './LogoutButton';
import { useLogin } from './hooks/useLogin';
import { LoginDTOZodSchema } from '../../../../../../libs/models/schemas/auth';

export const LoginFormModule = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(LoginDTOZodSchema),
	});
	const { mutate } = useLogin();

	console.log('ERRORS', errors);

	const onSubmit = handleSubmit(data => {
		console.log('DATA', data);
		mutate(data);
	});

	return (
		<form
			onSubmit={onSubmit}
			style={{
				display: 'flex',
				flexDirection: 'column',
				width: '400px',
				gap: '10px',
			}}>
			<label htmlFor='email'>Почта</label>
			<input
				{...register('email')}
				value={'alexo@example.com'}
				type='text'
				id='email'
			/>
			<label htmlFor='password'>Пароль</label>
			<input
				{...register('password')}
				value={'123123'}
				type='password'
				id='password'
			/>
			<button type='submit'>Готово</button>

			<LogoutButton />
		</form>
	);
};
