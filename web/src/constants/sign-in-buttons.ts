import type { ISvg } from "@/types/svgl-icon";

interface ISignInButton {
	provider: "github" | "google";
	icon: ISvg;
}

export const signInButtons: ISignInButton[] = [
	{
		provider: "github",
		icon: {
			id: 17,
			title: "Github",
			category: "Software",
			route: {
				light: "https://svgl.app/library/github-light.svg",
				dark: "https://svgl.app/library/github-dark.svg",
			},
			url: "https://github.com/",
		},
	},
	{
		provider: "google",
		icon: {
			id: 57,
			title: "Google",
			category: "Google",
			route: "https://svgl.app/library/google.svg",
			wordmark: "https://svgl.app/library/google-wordmark.svg",
			url: "https://www.google.com/",
		},
	},
];
