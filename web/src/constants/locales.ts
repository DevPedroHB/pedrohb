export const locales = ["pt", "en"] as const;

export type Locales = (typeof locales)[number];

interface ILanguage {
	code: Locales;
	name: string;
}

export const languages: ILanguage[] = [
	{
		code: "pt",
		name: "Português",
	},
	{
		code: "en",
		name: "English",
	},
];
