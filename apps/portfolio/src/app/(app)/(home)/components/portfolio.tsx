import { Card, CardContent } from "@/components/ui/card";

export function Portfolio() {
	return (
		<section id="portfolio" className="section__container">
			<h2 className="section__title">Portfólio</h2>
			<p className="section__subtitle">Trabalhos mais recentes</p>
			<Card>
				<CardContent>Conteúdo da section Portfolio</CardContent>
			</Card>
		</section>
	);
}
