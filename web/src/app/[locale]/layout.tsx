import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/functions/cn";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "../globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	variable: "--font-poppins",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("metadata");

	return {
		title: {
			template: "%s | PedroHB",
			default: "PedroHB",
		},
		description: t("description"),
	};
}

interface IRootLayout {
	children: ReactNode;
	params: {
		locale: string;
	};
}

export default async function RootLayout({
	children,
	params: { locale },
}: Readonly<IRootLayout>) {
	const messages = await getMessages({ locale });

	return (
		<html
			lang={locale}
			className={cn(
				"scroll-smooth font-sans antialiased",
				"scrollbar-thin scrollbar-track-muted scrollbar-thumb-primary scrollbar-thumb-rounded-full",
				poppins.variable,
			)}
			suppressHydrationWarning
		>
			<body className="min-h-screen bg-background text-foreground">
				<NextIntlClientProvider messages={messages}>
					<ThemeProvider>
						{children}
						<Toaster richColors pauseWhenPageIsHidden />
					</ThemeProvider>
				</NextIntlClientProvider>
			</body>
		</html>
	);
}
