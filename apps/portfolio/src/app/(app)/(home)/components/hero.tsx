import { Card, CardContent } from "@/components/ui/card";

export function Hero() {
	return (
		<section id="hero" className="section__container">
			<h2 className="section__title">Olá, eu sou Pedro</h2>
			<p className="section__subtitle">Engenheiro de software</p>
			<Card>
				<CardContent>Conteúdo da section Hero</CardContent>
			</Card>
		</section>
	);
}
