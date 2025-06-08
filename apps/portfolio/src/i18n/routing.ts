import { keys } from "@/constants/keys";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales: ["pt", "en"],
	defaultLocale: "pt",
	localeCookie: {
		name: keys.LOCALE,
	},
});
