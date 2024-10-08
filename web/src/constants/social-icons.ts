import type { ISvg } from "@/types/svgl-icon";

export const socialIcons: ISvg[] = [
	{
		id: 17,
		title: "Github",
		category: "Software",
		route: {
			light: "https://svgl.app/library/github-light.svg",
			dark: "https://svgl.app/library/github-dark.svg",
		},
		url: "https://github.com/",
	},
	{
		id: 61,
		title: "LinkedIn",
		category: "Social",
		route: "https://svgl.app/library/linkedin.svg",
		url: "https://www.linkedin.com/",
	},
	{
		id: 219,
		title: "Instagram",
		category: "Social",
		route: {
			light: "https://svgl.app/library/instagram.svg",
			dark: "https://svgl.app/library/instagram_dark.svg",
		},
		url: "https://www.instagram.com/",
	},
];
