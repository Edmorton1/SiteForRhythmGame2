import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMain, LazyRegistration, LazyTracks } from "./LazyPages";
import { clientPaths } from "../common/const/PATHS";
import { Main } from "../base/Main";
import { serverPaths } from "../../../../libs/shared/PATHS";

export function App() {
	console.log(_URL_SERVER + serverPaths.me);

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
						path={clientPaths.tracks}
						element={<LazyTracks />}
					/>
				</Route>
			</Routes>
		</BrowserRouter>
	);
}
