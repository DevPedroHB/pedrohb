import type { ReactNode } from "react";

interface IAppLayout {
	children: ReactNode;
}

export default function AppLayout({ children }: Readonly<IAppLayout>) {
	return <>{children}</>;
}
