import type { Metadata } from "next";
import { AboutMe } from "./components/about-me";
import { ContactMe } from "./components/contact-me";
import { Hero } from "./components/hero";
import { NewProject } from "./components/new-project";
import { Portfolio } from "./components/portfolio";
import { Qualification } from "./components/qualification";
import { Services } from "./components/services";
import { Skills } from "./components/skills";
import { Testimonials } from "./components/testimonials";

export const metadata: Metadata = {
	title: "Início",
};

export default function Home() {
	return (
		<main className="main__container">
			<Hero />
			<AboutMe />
			<Skills />
			<Qualification />
			<Services />
			<Portfolio />
			<NewProject />
			<Testimonials />
			<ContactMe />
		</main>
	);
}
