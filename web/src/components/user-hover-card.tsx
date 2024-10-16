import type { ComponentProps } from "react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { UserCard } from "./user-card";

interface IUserHoverCard extends ComponentProps<typeof HoverCardTrigger> {}

export function UserHoverCard(props: IUserHoverCard) {
	return (
		<HoverCard>
			<HoverCardTrigger {...props} />
			<HoverCardContent className="p-0 max-w-64" asChild>
				<UserCard />
			</HoverCardContent>
		</HoverCard>
	);
}
