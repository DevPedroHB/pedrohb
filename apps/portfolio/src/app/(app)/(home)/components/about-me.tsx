import { Card, CardContent } from "@/components/ui/card";

export function AboutMe() {
	return (
		<section id="about-me" className="section__container">
			<h2 className="section__title">Sobre mim</h2>
			<p className="section__subtitle">Minha introdução</p>
			<Card>
				<CardContent>Conteúdo da section AboutMe</CardContent>
			</Card>
		</section>
	);
}
