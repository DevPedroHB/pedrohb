"use client";

import { useRouter } from "@/i18n/routing";
import { useToggle } from "@uidotdev/usehooks";
import {
	Languages,
	LogIn,
	LogOut,
	Settings,
	SunMoon,
	User2,
} from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useHotkeys } from "react-hotkeys-hook";
import { toast } from "sonner";
import { SingInDialog } from "../sign-in-dialog";
import { SingOutDialog } from "../sign-out-dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { UserAvatar } from "../user-avatar";
import { UserHoverCard } from "../user-hover-card";
import { NavbarChangeLanguage } from "./navbar-change-language";
import { NavbarChangeTheme } from "./navbar-change-theme";

export function NavbarProfileMenu() {
	const [dropdownMenu, setDropdownMenu] = useToggle(false);
	const [signIn, setSignIn] = useToggle(false);
	const [signOut, setSignOut] = useToggle(false);
	const t = useTranslations("components.navbar.profile-menu");
	const router = useRouter();
	const user = false;

	useHotkeys("alt+p", () => router.push("/profile/PedroHB"), {
		enabled: !!user && dropdownMenu,
	});

	useHotkeys("alt+i", () => setSignIn(!signIn), {
		enabled: !user && dropdownMenu,
	});

	useHotkeys("alt+s", () => toast.info("Você abriu o menu de configurações."), {
		enabled: !!user && dropdownMenu,
	});

	useHotkeys("alt+o", () => setSignOut(!signOut), {
		enabled: !!user && dropdownMenu,
	});

	return (
		<DropdownMenu open={dropdownMenu} onOpenChange={setDropdownMenu}>
			<UserHoverCard asChild>
				<DropdownMenuTrigger>
					<UserAvatar
						src="https://github.com/DevPedroHB.png"
						alt="PedroHB"
						className="size-8"
					/>
				</DropdownMenuTrigger>
			</UserHoverCard>
			<DropdownMenuContent>
				<DropdownMenuLabel>{t("label")}</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					{user && (
						<>
							<DropdownMenuItem asChild>
								<Link href={"/profile/pedroHB"}>
									<User2 className="size-4" />
									{t("items.profile")}
									<DropdownMenuShortcut>ALT+P</DropdownMenuShortcut>
								</Link>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings className="size-4" />
								{t("items.settings")}
								<DropdownMenuShortcut>ALT+S</DropdownMenuShortcut>
							</DropdownMenuItem>
						</>
					)}
					<NavbarChangeLanguage>
						<Languages className="size-4" />
						{t("items.language")}
					</NavbarChangeLanguage>
					<NavbarChangeTheme>
						<SunMoon className="size-4" />
						{t("items.theme")}
					</NavbarChangeTheme>
					<DropdownMenuSeparator />
					{user ? (
						<DropdownMenuItem asChild>
							<SingOutDialog
								open={signOut}
								onOpenChange={setSignOut}
								className="w-full"
							>
								<LogOut className="size-4" />
								{t("items.sign-out")}
								<DropdownMenuShortcut>ALT+O</DropdownMenuShortcut>
							</SingOutDialog>
						</DropdownMenuItem>
					) : (
						<DropdownMenuItem asChild>
							<SingInDialog
								open={signIn}
								onOpenChange={setSignIn}
								className="w-full"
							>
								<LogIn className="size-4" />
								{t("items.sign-in")}
								<DropdownMenuShortcut>ALT+I</DropdownMenuShortcut>
							</SingInDialog>
						</DropdownMenuItem>
					)}
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
