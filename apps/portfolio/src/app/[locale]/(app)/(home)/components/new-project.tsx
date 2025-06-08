import { getTranslations } from "next-intl/server";

export async function NewProject() {
	const t = await getTranslations("app.home.section.new_project");

	return (
		<section id="new-project" className="section__container">
			<h2 className="section__title">{t("title")}</h2>
			<p className="section__subtitle">{t("subtitle")}</p>
		</section>
	);
}
