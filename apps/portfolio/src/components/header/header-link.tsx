"use client";

import { cn } from "@/functions/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { useRouter } from "next/navigation";
import { Link, type LinkProps } from "react-scroll";

export const headerLink = cva(
	"flex justify-center items-center font-medium hover:text-primary text-sm transition cursor-pointer",
	{
		variants: {
			variant: {
				default: "",
				mobile: "flex-col",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

interface IHeaderLink
	extends Omit<LinkProps, "ref">,
		VariantProps<typeof headerLink> {}

export function HeaderLink({ variant, to, className, ...props }: IHeaderLink) {
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
			className={cn(headerLink({ variant }), className)}
			isDynamic
			hashSpy
			spy
			{...props}
		/>
	);
}
