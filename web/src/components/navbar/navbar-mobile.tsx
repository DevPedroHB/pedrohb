"use client";

import { navbarLinks } from "@/constants/navbar-links";
import { useToggle } from "@uidotdev/usehooks";
import * as Lucide from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollLink } from "../scroll-link";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export function NavbarMobile() {
	const t = useTranslations("components.navbar");
	const [open, setOpen] = useToggle(false);

	function handleOpenChange() {
		setOpen(false);
	}

	return (
		<Sheet open={open} onOpenChange={setOpen}>
			<SheetTrigger className="md:hidden">
				<Lucide.LayoutGrid className="size-5 transition-all hover:text-primary" />
			</SheetTrigger>
			<SheetContent
				side="bottom"
				className="grid grid-cols-3 gap-8 rounded-t-xl px-6 py-8"
			>
				{navbarLinks.map((link) => {
					const Icon = Lucide[link.icon] as Lucide.LucideIcon;

					return (
						<ScrollLink
							key={link.path}
							variant="responsive"
							to={link.path}
							onClick={handleOpenChange}
						>
							<Icon className="size-5 md:hidden" />
							{t(`navbar-links.${link.path}`)}
						</ScrollLink>
					);
				})}
			</SheetContent>
		</Sheet>
	);
}
