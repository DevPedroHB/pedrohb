import { cn } from "@/functions/cn";
import { User2 } from "lucide-react";
import type { ComponentProps } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface IUserAvatar extends ComponentProps<typeof AvatarImage> {}

export function UserAvatar({ className, ...rest }: IUserAvatar) {
	return (
		<Avatar className={cn(className)}>
			<AvatarImage {...rest} />
			<AvatarFallback>
				<User2 className="size-1/2 text-muted-foreground" />
			</AvatarFallback>
		</Avatar>
	);
}
