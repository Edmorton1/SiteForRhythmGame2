import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyLogin, LazyMain, LazyRegistration } from "./LazyPages";
import { clientPaths } from "../common/consts/PATHS";
import { Main } from "../base/Main";

export const App = () => {
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
				</Route>
			</Routes>
		</BrowserRouter>
	);
};
