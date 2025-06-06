import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { ReactNode } from "react";
import "./globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
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
			className={`${geistSans.variable} ${geistMono.variable} antialiased scroll-smooth`}
			suppressHydrationWarning
		>
			<body>{children}</body>
		</html>
	);
}
