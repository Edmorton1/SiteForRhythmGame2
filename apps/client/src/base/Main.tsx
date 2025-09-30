import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import style from './main.module.scss';

const { main } = style;

export const Main = () => {
	return (
		<>
			<Header />
			<main className={main}>
				<Outlet />
			</main>
		</>
	);
};
