import type { routing } from "@/i18n/routing";
import "next-intl";
import type messages from "../../messages/pt.json";

declare module "next-intl" {
	interface AppConfig {
		Locale: (typeof routing.locales)[number];
		Messages: typeof messages;
	}
}
