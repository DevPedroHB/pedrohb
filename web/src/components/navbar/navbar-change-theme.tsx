"use client";

import { themes } from "@/constants/themes";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
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

interface INavbarChangeTheme
	extends ComponentProps<typeof DropdownMenuSubTrigger> {}

export function NavbarChangeTheme(props: INavbarChangeTheme) {
	const t = useTranslations("components.navbar.change-theme");
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenuSub>
			<DropdownMenuSubTrigger {...props} />
			<DropdownMenuPortal>
				<DropdownMenuSubContent>
					<DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						{themes.map((theme, index) => {
							return (
								<DropdownMenuRadioItem key={`${index}-${theme}`} value={theme}>
									{t(`items.${theme}`)}
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuSubContent>
			</DropdownMenuPortal>
		</DropdownMenuSub>
	);
}
