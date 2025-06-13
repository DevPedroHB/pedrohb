"use client";

import { usePathname, useRouter } from "next/navigation";
import { type ComponentProps, useCallback, useEffect, useRef } from "react";
import { Dialog, DialogContent } from "./ui/dialog";

interface IInterceptingDialog extends ComponentProps<typeof DialogContent> {}

export function InterceptingDialog(props: IInterceptingDialog) {
	const router = useRouter();
	const pathname = usePathname();
	const pathnameRef = useRef(pathname);

	const handleOpenChange = useCallback(() => {
		router.back();
	}, [router]);

	useEffect(() => {
		if (pathname !== pathnameRef.current) {
			handleOpenChange();
		}
	}, [pathname, handleOpenChange]);

	return (
		<Dialog defaultOpen onOpenChange={handleOpenChange}>
			<DialogContent {...props} />
		</Dialog>
	);
}
