"use client";

import { type Locales, languages } from "@/constants/locales";
import { usePathname, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import {
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
} from "../ui/dropdown-menu";

interface INavbarChangeLanguage
	extends ComponentProps<typeof DropdownMenuSubTrigger> {}

export function NavbarChangeLanguage(props: INavbarChangeLanguage) {
	const t = useTranslations("components.navbar.change-language");
	const locale = useLocale();
	const router = useRouter();
	const pathname = usePathname();

	function handleChangeLocale(value: string) {
		router.replace(pathname, { locale: value as Locales });
	}

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger {...props} />
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup
						value={locale}
						onValueChange={handleChangeLocale}
					>
						{languages.map((language) => {
							return (
								<DropdownMenuRadioItem
									key={language.code}
									value={language.code}
								>
									{language.name}
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}
