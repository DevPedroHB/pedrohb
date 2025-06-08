import { getTranslations } from "next-intl/server";

export async function AboutMe() {
	const t = await getTranslations("app.home.section.about_me");

	return (
		<section id="about-me" className="section__container">
			<h2 className="section__title">{t("title")}</h2>
			<p className="section__subtitle">{t("subtitle")}</p>
		</section>
	);
}
