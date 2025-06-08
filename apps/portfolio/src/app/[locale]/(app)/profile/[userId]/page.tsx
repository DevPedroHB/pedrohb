import type { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

interface IUserProfile {
	params: Promise<{
		locale: (typeof routing.locales)[number];
		userId: string;
	}>;
}

export async function generateMetadata({
	params,
}: IUserProfile): Promise<Metadata> {
	const { locale, userId } = await params;
	const t = await getTranslations({ locale, namespace: "app.user_profile" });

	return {
		title: t("title", { name: userId }),
	};
}

export default async function UserProfile({ params }: IUserProfile) {
	const { userId } = await params;
	const t = await getTranslations("app.user_profile");

	return (
		<main className="main__container">
			<section id="user-profile" className="section__container">
				<h2 className="section__title">
					{t("section.user_profile.title", { name: userId })}
				</h2>
				<p className="section__subtitle">
					{t("section.user_profile.subtitle", { name: userId })}
				</p>
			</section>
		</main>
	);
}
