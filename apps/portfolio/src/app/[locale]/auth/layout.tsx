import { getSessionAction } from "@/actions/get-session-action";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";

interface IAuthLayout {
	children: ReactNode;
}

export default async function AuthLayout({ children }: Readonly<IAuthLayout>) {
	const { data } = await getSessionAction();

	if (data?.token) {
		return redirect("/");
	}

	return (
		<div className="flex flex-col justify-center items-center p-6 md:p-10 min-h-svh">
			{children}
		</div>
	);
}
