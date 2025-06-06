"use client";

import { themes } from "@/constants/themes";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export default function ToggleTheme() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button type="button" size="icon">
					<SunMoon className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel>Temas</DropdownMenuLabel>
				<DropdownMenuGroup>
					<DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
						{themes.map((theme) => {
							const Icon = theme.icon;

							return (
								<DropdownMenuRadioItem key={theme.value} value={theme.value}>
									{theme.name}
									<DropdownMenuShortcut>
										<Icon className="size-4" />
									</DropdownMenuShortcut>
								</DropdownMenuRadioItem>
							);
						})}
					</DropdownMenuRadioGroup>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
