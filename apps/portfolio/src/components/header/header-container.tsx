"use client";

import type { ComponentProps } from "react";
import { useWindowScroll } from "react-use";

interface IHeaderContainer extends ComponentProps<"header"> {}

export function HeaderContainer(props: IHeaderContainer) {
	const { y } = useWindowScroll();

	return (
		<header
			data-scroll={y > 0}
			className="md:top-0 not-md:bottom-0 z-50 fixed inset-x-0 bg-background data-[scroll=true]:shadow-header"
			{...props}
		/>
	);
}
