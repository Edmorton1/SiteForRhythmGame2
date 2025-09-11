import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export const Main = () => {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	);
};
