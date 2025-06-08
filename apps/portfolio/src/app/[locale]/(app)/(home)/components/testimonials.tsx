import { getTranslations } from "next-intl/server";

export async function Testimonials() {
	const t = await getTranslations("app.home.section.testimonials");

	return (
		<section id="testimonials" className="section__container">
			<h2 className="section__title">{t("title")}</h2>
			<p className="section__subtitle">{t("subtitle")}</p>
		</section>
	);
}
