import type { ReactNode } from "react";

interface IAppLayout {
	children: ReactNode;
}

export default function AppLayout({ children }: Readonly<IAppLayout>) {
	return (
		<div className="space-y-4 mx-auto px-4 max-w-7xl min-h-screen">
			{children}
		</div>
	);
}
