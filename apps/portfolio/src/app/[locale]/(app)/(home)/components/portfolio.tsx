import { getTranslations } from "next-intl/server";

export async function Portfolio() {
	const t = await getTranslations("app.home.section.portfolio");

	return (
		<section id="portfolio" className="section__container">
			<h2 className="section__title">{t("title")}</h2>
			<p className="section__subtitle">{t("subtitle")}</p>
		</section>
	);
}
