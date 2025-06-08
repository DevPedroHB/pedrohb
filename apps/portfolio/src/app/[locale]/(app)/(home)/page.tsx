import type { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { AboutMe } from "./components/about-me";
import { ContactMe } from "./components/contact-me";
import { Hero } from "./components/hero";
import { NewProject } from "./components/new-project";
import { Portfolio } from "./components/portfolio";
import { Qualifications } from "./components/qualifications";
import { Services } from "./components/services";
import { Skills } from "./components/skills";
import { Testimonials } from "./components/testimonials";

interface IHome {
	params: Promise<{
		locale: (typeof routing.locales)[number];
	}>;
}

export async function generateMetadata({ params }: IHome): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app.home" });

	return {
		title: t("title"),
	};
}

export default function Home() {
	return (
		<main className="main__container">
			<Hero />
			<AboutMe />
			<Skills />
			<Qualifications />
			<Services />
			<Portfolio />
			<NewProject />
			<Testimonials />
			<ContactMe />
		</main>
	);
}
