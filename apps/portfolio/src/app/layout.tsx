import { Toaster } from "@/components/ui/sonner";
import { cn } from "@/functions/cn";
import { ThemeProvider } from "@/providers/theme-provider";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const poppins = Poppins({
	variable: "--font-poppins",
	subsets: ["latin"],
	display: "swap",
	weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
	title: {
		default: "PedroHB",
		template: "%s | PedroHB",
	},
	description:
		"Portfólio pessoal de Pedro Henrique Bérgamo. Desenvolvedor Full-Stack.",
};

interface IRootLayout {
	children: ReactNode;
}

export default function RootLayout({ children }: Readonly<IRootLayout>) {
	return (
		<html
			lang="pt-BR"
			className={cn("antialiased scroll-smooth", poppins.variable)}
			suppressHydrationWarning
		>
			<body>
				<ThemeProvider>
					{children}
					<Toaster visibleToasts={9} richColors />
				</ThemeProvider>
			</body>
		</html>
	);
}
