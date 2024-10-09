import type Lucide from "lucide-react";

interface INavbarLink {
	icon: keyof typeof Lucide;
	path: "hero" | "about" | "skills" | "services" | "portfolio" | "contact";
}

export const navbarLinks: INavbarLink[] = [
	{
		icon: "Home",
		path: "hero",
	},
	{
		icon: "User2",
		path: "about",
	},
	{
		icon: "FileText",
		path: "skills",
	},
	{
		icon: "Briefcase",
		path: "services",
	},
	{
		icon: "Image",
		path: "portfolio",
	},
	{
		icon: "SendHorizontal",
		path: "contact",
	},
];
