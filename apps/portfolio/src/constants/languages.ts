import type { routing } from "@/i18n/routing";
import { BR, type FlagComponent, US } from "country-flag-icons/react/3x2";

export type Language = {
	key: (typeof routing.locales)[number];
	name: string;
	flag: FlagComponent;
};

export const languages: Language[] = [
	{
		key: "pt",
		name: "Português",
		flag: BR,
	},
	{
		key: "en",
		name: "English",
		flag: US,
	},
] as const;
