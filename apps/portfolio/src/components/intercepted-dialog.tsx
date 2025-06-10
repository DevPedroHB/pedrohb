"use client";

import { useRouter } from "next/navigation";
import type { ComponentProps } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

interface IInterceptedDialog extends ComponentProps<typeof DialogContent> {}

export function InterceptedDialog(props: IInterceptedDialog) {
	const router = useRouter();

	function onDismiss() {
		router.back();
	}

	return (
		<Dialog defaultOpen onOpenChange={onDismiss}>
			<DialogContent {...props} />
		</Dialog>
	);
}
