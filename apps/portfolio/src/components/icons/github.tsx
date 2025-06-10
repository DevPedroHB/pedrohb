"use client";

import { GitHubDark, GitHubLight } from "@ridemountainpig/svgl-react";
import { useTheme } from "next-themes";
import type { SVGProps } from "react";

export function GitHub(props: SVGProps<SVGSVGElement>) {
	const { resolvedTheme } = useTheme();

	if (resolvedTheme === "dark") {
		return <GitHubDark {...props} />;
	}

	if (resolvedTheme === "light") {
		return <GitHubLight {...props} />;
	}
}
