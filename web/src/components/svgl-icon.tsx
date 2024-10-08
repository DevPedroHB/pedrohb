"use client";

import { cn } from "@/functions/cn";
import type { ISvg } from "@/types/svgl-icon";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

interface ISvglIcon {
	icon: ISvg;
	className?: string;
	useWordmark?: boolean;
}

export function SvglIcon({ icon, useWordmark, className }: ISvglIcon) {
	const { theme, systemTheme } = useTheme();

	const getCurrentTheme = () => {
		if (theme === "system") {
			return systemTheme === "dark" ? "dark" : "light";
		}

		return theme === "dark" ? "dark" : "light";
	};

	const getIconSrc = () => {
		const currentTheme = getCurrentTheme();
		const source = useWordmark && icon.wordmark ? icon.wordmark : icon.route;

		if (typeof source === "string") {
			return source;
		}

		return source[currentTheme];
	};

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Link href={icon.url} target="_blank">
					<Image
						src={getIconSrc()}
						alt={icon.title}
						className={cn(className)}
						width={256}
						height={256}
					/>
				</Link>
			</TooltipTrigger>
			<TooltipContent>{icon.title}</TooltipContent>
		</Tooltip>
	);
}
