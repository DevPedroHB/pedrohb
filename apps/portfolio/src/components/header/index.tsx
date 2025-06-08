"use client";

import { navbarLinks } from "@/constants/navbar-links";
import Link from "next/link";
import { useWindowScroll } from "react-use";
import { HeaderLink } from "./header-link";
import { HeaderMobile } from "./header-mobile";
import { HeaderProfile } from "./header-profile";

export function Header() {
	const { y } = useWindowScroll();

	return (
		<header
			data-scroll={y > 0}
			className="md:top-0 not-md:bottom-0 z-50 fixed inset-x-0 bg-background data-[scroll=true]:shadow-header"
		>
			<nav className="flex justify-between items-center gap-4 mx-auto px-6 max-w-[calc(60.5rem+3rem)] h-12 md:h-[4.5rem]">
				<Link href="/" className="font-medium hover:text-primary transition">
					PedroHB
				</Link>
				<div className="hidden md:flex md:flex-1 md:justify-end md:gap-8">
					{navbarLinks.map((link) => {
						return (
							<HeaderLink key={link.path} to={link.path}>
								{link.name}
							</HeaderLink>
						);
					})}
				</div>
				<div className="flex items-center gap-4">
					<HeaderProfile />
					<HeaderMobile />
				</div>
			</nav>
		</header>
	);
}
