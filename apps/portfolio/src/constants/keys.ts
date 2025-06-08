import { formatKeyStorage } from "@/functions/format-key-storage";

export const keys = {
	LOCALE: formatKeyStorage("locale"),
	THEME: formatKeyStorage("theme"),
} as const;
