"use client";

import { signOutAction } from "@/actions/auth/sign-out-action";
import { useTranslations } from "next-intl";
import { useAction } from "next-safe-action/hooks";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "./ui/alert-dialog";

interface ISignOutAlertDialog
	extends ComponentProps<typeof AlertDialogTrigger> {}

export function SignOutAlertDialog(props: ISignOutAlertDialog) {
	const t = useTranslations("components.sign_out_alert_dialog");
	const { execute, isPending } = useAction(signOutAction, {
		onNavigation() {
			toast.success(t("success"));
		},
	});

	return (
		<AlertDialog>
			<AlertDialogTrigger {...props} />
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("title")}</AlertDialogTitle>
					<AlertDialogDescription>{t("description")}</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel type="button">
						{t("buttons.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction
						type="button"
						onClick={() => execute()}
						disabled={isPending}
					>
						{t("buttons.action")}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
