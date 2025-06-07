import { Card, CardContent } from "@/components/ui/card";

export function Services() {
	return (
		<section id="services" className="section__container">
			<h2 className="section__title">Serviços</h2>
			<p className="section__subtitle">O que eu ofereço</p>
			<Card>
				<CardContent>Conteúdo da section Services</CardContent>
			</Card>
		</section>
	);
}
