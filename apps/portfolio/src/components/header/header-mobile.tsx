"use client";

import { navbarLinks } from "@/constants/navbar-links";
import { LayoutGrid, X } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerTrigger,
} from "../ui/drawer";
import { HeaderLink } from "./header-link";
import { HeaderProfile } from "./header-profile";

export function HeaderMobile() {
	const t = useTranslations("components.header");

	return (
		<Drawer>
			<DrawerTrigger asChild>
				<LayoutGrid className="md:hidden size-5" />
			</DrawerTrigger>
			<DrawerContent>
				<div className="gap-8 grid grid-cols-3 px-6 py-8">
					{navbarLinks.map((link) => {
						const Icon = link.icon;

						return (
							<DrawerClose key={link.key} asChild>
								<HeaderLink to={link.path} variant="mobile">
									<Icon className="size-4" />
									{t(`navbar_links.${link.key}`)}
								</HeaderLink>
							</DrawerClose>
						);
					})}
				</div>
				<div className="flex justify-between items-center gap-4 mx-auto px-6 w-full max-w-[calc(60.5rem+3rem)] h-12">
					<Link
						href="/"
						className="font-medium hover:text-primary transition-all"
					>
						{t("title")}
					</Link>
					<div className="flex items-center gap-4">
						<HeaderProfile />
						<DrawerClose asChild>
							<X className="size-5" />
						</DrawerClose>
					</div>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
