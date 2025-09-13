import { useLogout } from './hooks/useLogout';

export const LogoutButton = () => {
	const { mutate } = useLogout();

	const handleClick = () => mutate();

	return (
		<button
			onClick={handleClick}
			type='button'>
			Выйти
		</button>
	);
};
