"use client";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { signInButtons } from "@/constants/sign-in-buttons";
import type { BuiltInProviderType } from "next-auth/providers";
import { type LiteralUnion, signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import type { ComponentProps } from "react";
import { SvglIcon } from "./svgl-icon";
import { TooltipProvider } from "./ui/tooltip";

interface ISingInDialog extends ComponentProps<typeof AlertDialogTrigger> {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

export function SingInDialog({ open, onOpenChange, ...rest }: ISingInDialog) {
	const t = useTranslations("components.sign-in-dialog");

	async function handleSignIn(provider: LiteralUnion<BuiltInProviderType>) {
		await signIn(provider);
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogTrigger {...rest} />
			<AlertDialogContent className="max-w-xs">
				<AlertDialogHeader>
					<AlertDialogTitle>{t("title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("description")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<TooltipProvider>
						{signInButtons.map((button) => {
							return (
								<AlertDialogAction
									key={button.provider}
									type="button"
									variant="outline"
									onClick={() => handleSignIn(button.provider)}
									className="flex-1"
								>
									<SvglIcon icon={button.icon} className="size-5" />
									{button.icon.title}
								</AlertDialogAction>
							);
						})}
					</TooltipProvider>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
