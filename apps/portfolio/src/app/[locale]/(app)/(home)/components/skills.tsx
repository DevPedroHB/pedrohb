import { getTranslations } from "next-intl/server";

export async function Skills() {
	const t = await getTranslations("app.home.section.skills");

	return (
		<section id="skills" className="section__container">
			<h2 className="section__title">{t("title")}</h2>
			<p className="section__subtitle">{t("subtitle")}</p>
		</section>
	);
}
