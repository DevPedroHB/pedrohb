import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-avatar";
import { UserHoverCard } from "@/components/user-hover-card";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations("metadata");

	return {
		title: t("titles.home"),
	};
}

export default function Home() {
	return (
		<main className="min-h-screen flex flex-col items-center justify-center gap-4">
			<h1>Page Home</h1>
			<UserHoverCard>
				<UserAvatar src="https://github.com/DevPedroHB.png" alt="PedroHB" />
			</UserHoverCard>
			<Button>Botão</Button>
		</main>
	);
}
