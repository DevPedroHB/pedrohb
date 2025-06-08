import type { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface IProfile {
	params: Promise<{
		locale: (typeof routing.locales)[number];
	}>;
}

export async function generateMetadata({
	params,
}: IProfile): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app.profile" });

	return {
		title: t("title"),
	};
}

export default async function Profile() {
	const t = await getTranslations("app.profile");

	return (
		<main className="main__container">
			<section id="profile" className="section__container">
				<h2 className="section__title">{t("section.profile.title")}</h2>
				<p className="section__subtitle">{t("section.profile.subtitle")}</p>
			</section>
		</main>
	);
}
