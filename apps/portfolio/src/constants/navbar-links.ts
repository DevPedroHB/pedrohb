import type { components } from "@messages/pt.json";
import {
	Briefcase,
	FileText,
	Home,
	Image,
	type LucideIcon,
	SendHorizontal,
	User2,
} from "lucide-react";

export type NavbarLink = {
	key: keyof (typeof components.header)["navbar_links"];
	icon: LucideIcon;
	path: string;
};

export const navbarLinks: NavbarLink[] = [
	{
		key: "hero",
		icon: Home,
		path: "/#hero",
	},
	{
		key: "about_me",
		icon: User2,
		path: "/#about-me",
	},
	{
		key: "skills",
		icon: FileText,
		path: "/#skills",
	},
	{
		key: "services",
		icon: Briefcase,
		path: "/#services",
	},
	{
		key: "portfolio",
		icon: Image,
		path: "/#portfolio",
	},
	{
		key: "contact_me",
		icon: SendHorizontal,
		path: "/#contact-me",
	},
] as const;
