import { cn } from "@/functions/cn";
import { type VariantProps, cva } from "class-variance-authority";
import type { ComponentProps } from "react";
import { ScrollLink } from "../scroll-link";

export const headerLink = cva(
	"flex justify-center items-center font-medium hover:text-primary text-sm transition-all cursor-pointer",
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
	extends ComponentProps<typeof ScrollLink>,
		VariantProps<typeof headerLink> {}

export function HeaderLink({ variant, className, ...props }: IHeaderLink) {
	return (
		<ScrollLink className={cn(headerLink({ variant }), className)} {...props} />
	);
}
