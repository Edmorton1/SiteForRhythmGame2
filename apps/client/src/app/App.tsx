import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LazyLogin, LazyMain, LazyRegistration, LazyTracks } from './LazyPages';
import { clientPaths } from '../common/consts/PATHS';
import { Main } from '../base/Main';
import { useLoadColors } from './useLoadColors';

export const App = () => {
	useLoadColors();

	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Main />}>
					<Route
						path={clientPaths.home}
						element={<LazyMain />}
					/>
					<Route
						path={clientPaths.registration}
						element={<LazyRegistration />}
					/>
					<Route
						path={clientPaths.login}
						element={<LazyLogin />}
					/>
					<Route
						path={clientPaths.tracks}
						element={<LazyTracks />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
