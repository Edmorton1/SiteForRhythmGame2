import { Outlet } from "react-router-dom";
import { Header } from "./Header";

export function Main() {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	);
}
