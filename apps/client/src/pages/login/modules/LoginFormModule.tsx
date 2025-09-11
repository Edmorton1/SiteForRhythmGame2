import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { useLoginPost } from './stores/useLogin';
import { LogoutButton } from './LogoutButton';

export const LoginFormModule = () => {
	// TODO: ДУБЛИРОВАНИЕ ПОТОМ УБРАТЬ!!!
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm({
		resolver: zodResolver(z.object({ email: z.email(), password: z.string() })),
	});
	const { mutate } = useLoginPost();

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
