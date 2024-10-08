"use client";

import { THEME_KEY } from "@/constants/keys";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import type { ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...rest }: ThemeProviderProps) {
	return (
		<NextThemeProvider
			attribute="class"
			defaultTheme="system"
			storageKey={THEME_KEY}
			enableSystem
			{...rest}
		>
			{children}
		</NextThemeProvider>
	);
}
