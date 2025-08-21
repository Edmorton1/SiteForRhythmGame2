import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { LazyMain, LazyRegistration, LazyTracks } from "./LazyPages";
import { SERVER_PREFIX } from "../../../../libs/shared/CONST";
import { clientPaths } from "../common/const/PATHS";
import Main from "../base/Main";

function App() {
	console.log(SERVER_PREFIX);
	console.log(import.meta.env["VITE_MY_ENV"]);
	console.log(_URL_SERVER);

	useEffect(() => {
		void fetch(`${_URL_SERVER}/users`)
			.then(async data => data.json())
			.then(data => console.log(data));
	}, []);

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

export default App;
