import { lazy } from "react";

export const LazyRegistration = lazy(
	() => import("@apps/client/pages/registration/index"),
);
