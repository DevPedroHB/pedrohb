import { Header } from "@/components/header";
import { ScrollToTop } from "@/components/scroll-to-top";
import type { ReactNode } from "react";

interface IAppLayout {
	children: ReactNode;
}

export default function AppLayout({ children }: Readonly<IAppLayout>) {
	return (
		<>
			<Header />
			{children}
			<ScrollToTop />
		</>
	);
}
