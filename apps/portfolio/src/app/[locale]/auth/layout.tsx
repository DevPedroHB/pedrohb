import type { ReactNode } from "react";

interface IAuthLayout {
	children: ReactNode;
}

export default function AuthLayout({ children }: Readonly<IAuthLayout>) {
	return (
		<div className="flex flex-col justify-center items-center p-6 md:p-10 min-h-svh">
			{children}
		</div>
	);
}
