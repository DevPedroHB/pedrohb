import { getSessionAction } from "@/actions/get-session-action";
import { navbarLinks } from "@/constants/navbar-links";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ScrollLink } from "../scroll-link";
import { HeaderContainer } from "./header-container";
import { HeaderMobile } from "./header-mobile";
import { HeaderProfile } from "./header-profile";

export async function Header() {
	const t = await getTranslations("components.header");
	const { data } = await getSessionAction();

	return (
		<HeaderContainer>
			<nav className="flex justify-between items-center gap-4 mx-auto px-6 max-w-[calc(60.5rem+3rem)] h-12 md:h-[4.5rem]">
				<Link
					href="/"
					className="font-medium hover:text-primary transition-all"
				>
					{t("title")}
				</Link>
				<div className="hidden md:flex md:flex-1 md:justify-end md:gap-8">
					{navbarLinks.map((link) => {
						return (
							<ScrollLink
								key={link.key}
								to={link.path}
								className="font-medium hover:text-primary text-sm transition-all cursor-pointer"
							>
								{t(`navbar_links.${link.key}`)}
							</ScrollLink>
						);
					})}
				</div>
				<div className="flex items-center gap-4">
					<HeaderProfile session={data} />
					<HeaderMobile />
				</div>
			</nav>
		</HeaderContainer>
	);
}
