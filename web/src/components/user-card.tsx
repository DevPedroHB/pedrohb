"use client";

import { socialIcons } from "@/constants/social-icons";
import { cn } from "@/functions/cn";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import type { ComponentProps } from "react";
import { toast } from "sonner";
import { SvglIcon } from "./svgl-icon";
import { Badge } from "./ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardTitle,
} from "./ui/card";
import { TooltipProvider } from "./ui/tooltip";
import { UserAvatar } from "./user-avatar";
import { UserSettings } from "./user-settings";

interface IUserCard extends ComponentProps<typeof Card> {}

export function UserCard({ className, ...rest }: IUserCard) {
	const [_, copyToClipboard] = useCopyToClipboard();

	async function handleCopyToClipboard(value: string) {
		try {
			await copyToClipboard(value);

			toast.success(`Email ${value} copiado com sucesso.`);
		} catch (error) {
			toast.error("Não foi possível copiar o email.");
		}
	}

	return (
		<Card
			className={cn("relative w-full overflow-hidden", className)}
			{...rest}
		>
			<img
				src="/images/banner.jpg"
				alt="Banner"
				className="w-full h-[4.5rem] object-cover object-center"
			/>
			<CardContent className="mt-[calc(-.375rem-1.5rem)] flex flex-col items-center pb-2 text-center">
				<UserAvatar
					src="https://github.com/DevPedroHB.png"
					alt="PedroHB"
					className="size-[calc(3rem+.75rem)] border-4 border-card outline outline-2 outline-primary"
				/>
				<CardTitle className="mt-2 w-full truncate">
					Pedro Henrique Bérgamo
				</CardTitle>
				<CardDescription className="w-full truncate">
					Engenheiro de software
				</CardDescription>
				<span className="text-sm text-muted-foreground text-center mt-4">
					Sinta-se à vontade para explorar e não hesite em entrar em contato
					comigo para colaborações ou outras oportunidades. Estou sempre
					interessado em novos desafios.
				</span>
				<Badge
					className="mt-4 max-w-full"
					onClick={() => handleCopyToClipboard("pedroh.bergamo20@gmail.com")}
				>
					<span className="truncate">pedroh.bergamo20@gmail.com</span>
				</Badge>
			</CardContent>
			<CardFooter className="flex flex-wrap justify-center gap-4 pt-2">
				<TooltipProvider>
					{socialIcons.map((icon) => {
						return <SvglIcon key={icon.id} icon={icon} className="size-5" />;
					})}
				</TooltipProvider>
			</CardFooter>
			<UserSettings />
		</Card>
	);
}
