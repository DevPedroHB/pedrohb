"use client";

import { ArrowUp } from "lucide-react";
import { animateScroll } from "react-scroll";
import { useWindowScroll } from "react-use";
import { Button } from "./ui/button";

export function ScrollToTop() {
	const { y } = useWindowScroll();

	function handleScrollToTop() {
		animateScroll.scrollToTop();
	}

	return (
		<Button
			type="button"
			data-scroll={y >= 560}
			size="icon"
			onClick={handleScrollToTop}
			className="right-4 -bottom-1/5 data-[scroll=true]:bottom-20 z-40 fixed transition-all"
		>
			<ArrowUp strokeWidth={3} className="size-5" />
		</Button>
	);
}
