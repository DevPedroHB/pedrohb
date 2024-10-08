import { Button } from "@/components/ui/button";
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
		<main>
			<h1>Page Home</h1>
			<Button>Botão</Button>
		</main>
	);
}
