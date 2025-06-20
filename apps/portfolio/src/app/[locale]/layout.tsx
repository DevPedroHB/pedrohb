import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/functions/cn";
import { routing } from "@/i18n/routing";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Poppins } from "next/font/google";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import "../globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

interface IRootLayout {
	params: Promise<{
		locale: (typeof routing.locales)[number];
	}>;
	children: ReactNode;
	dialog: ReactNode;
}

export async function generateMetadata({
	params,
}: IRootLayout): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app" });

	return {
		title: {
			default: t("title"),
			template: `%s | ${t("title")}`,
		},
		description: t("description"),
	};
}

export default async function RootLayout({
	params,
	children,
	dialog,
}: Readonly<IRootLayout>) {
	const { locale } = await params;

	if (!hasLocale(routing.locales, locale)) {
		notFound();
	}

	setRequestLocale(locale);

	return (
		<html
			lang={locale}
			className={cn("antialiased scroll-smooth", poppins.variable)}
			suppressHydrationWarning
		>
			<body>
				<NextIntlClientProvider>
					<ThemeProvider>
						{children}
						{dialog}
						<Toaster visibleToasts={9} closeButton richColors />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
