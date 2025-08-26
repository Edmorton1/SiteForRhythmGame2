import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMain, LazyRegistration } from "./LazyPages";
import { clientPaths } from "../common/const/PATHS";
import { Main } from "../base/Main";

export function App() {
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
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
