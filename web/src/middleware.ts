import createMiddleware from "next-intl/middleware";
import { auth } from "./auth";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default auth((request) => {
	return intlMiddleware(request);
});

export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
