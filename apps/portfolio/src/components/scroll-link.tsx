"use client";

import { cn } from "@/functions/cn";
import { useRouter } from "next/navigation";
import { Link, type LinkProps } from "react-scroll";

interface IScrollLink extends Omit<LinkProps, "ref"> {}

export function ScrollLink({ to, className, ...props }: IScrollLink) {
	const router = useRouter();
	const hash = to.split("#")[1];

	function handleNavigation() {
		router.push(to);
	}

	return (
		<Link
			to={hash}
			href={to}
			onClick={handleNavigation}
			activeClass="text-primary"
			className={cn(className)}
			isDynamic
			hashSpy
			spy
			{...props}
		/>
	);
}
