import type { ReactNode } from "react";

interface IPedroHBLayout {
	children: ReactNode;
}

export default function PedroHBLayout({ children }: Readonly<IPedroHBLayout>) {
	return <>{children}</>;
}
