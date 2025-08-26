import { lazy } from "react";

export const LazyMain = lazy(async () => import("../pages/home/Home"));
export const LazyRegistration = lazy(
	async () => import("../pages/registration/Registration"),
);
