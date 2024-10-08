export type TSvgTheme = {
	light: string;
	dark: string;
};

export interface ISvg {
	id: number;
	title: string;
	category: string | string[];
	route: string | TSvgTheme;
	wordmark?: string | TSvgTheme;
	url: string;
}
