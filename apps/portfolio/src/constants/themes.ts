import type { components } from "@messages/pt.json";
import { type LucideIcon, Moon, Sun, SunMoon } from "lucide-react";

export type Theme = {
	key: keyof typeof components.header.header_profile.items.themes.items;
	icon: LucideIcon;
};

export const themes: Theme[] = [
	{
		key: "light",
		icon: Sun,
	},
	{
		key: "dark",
		icon: Moon,
	},
	{
		key: "system",
		icon: SunMoon,
	},
] as const;
