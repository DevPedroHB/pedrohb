"use client";

import { languages } from "@/constants/languages";
import { themes } from "@/constants/themes";
import { Link, usePathname } from "@/i18n/navigation";
import { User2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import NextLink from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuPortal,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function HeaderProfile() {
	const t = useTranslations("components.header.header_profile");
	const { theme, setTheme } = useTheme();
	const locale = useLocale();
	const pathname = usePathname();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Avatar className="size-8 md:size-10">
					<AvatarImage src="" alt="" />
					<AvatarFallback>
						<User2 className="size-4" />
					</AvatarFallback>
				</Avatar>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>{t("title")}</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuItem asChild>
						<NextLink href="/profile">
							{t("items.profile")}
							<DropdownMenuShortcut>ALT+P</DropdownMenuShortcut>
						</NextLink>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{t("items.language")}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup value={locale}>
									{languages.map((language) => {
										const Flag = language.flag;

										return (
											<Link
												key={language.key}
												href={pathname}
												locale={language.key}
											>
												<DropdownMenuRadioItem value={language.key}>
													{language.name}
													<DropdownMenuShortcut>
														<Flag />
													</DropdownMenuShortcut>
												</DropdownMenuRadioItem>
											</Link>
										);
									})}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
					<DropdownMenuSub>
						<DropdownMenuSubTrigger>
							{t("items.themes.title")}
						</DropdownMenuSubTrigger>
						<DropdownMenuPortal>
							<DropdownMenuSubContent>
								<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
									{themes.map((theme) => {
										const Icon = theme.icon;

										return (
											<DropdownMenuRadioItem key={theme.key} value={theme.key}>
												{t(`items.themes.items.${theme.key}`)}
												<DropdownMenuShortcut>
													<Icon />
												</DropdownMenuShortcut>
											</DropdownMenuRadioItem>
										);
									})}
								</DropdownMenuRadioGroup>
							</DropdownMenuSubContent>
						</DropdownMenuPortal>
					</DropdownMenuSub>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<NextLink href="/auth/sign-in">
						{t("items.sign_in")}
						<DropdownMenuShortcut>ALT+E</DropdownMenuShortcut>
					</NextLink>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
