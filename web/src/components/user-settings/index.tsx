import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "../ui/tooltip";

export function UserSettings() {
	return (
		<TooltipProvider>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						type="button"
						variant="outline"
						size="icon"
						className="absolute top-2 right-2"
					>
						<Settings className="size-5" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>Clique para configurar sua conta.</TooltipContent>
			</Tooltip>
		</TooltipProvider>
	);
}
