import { Card, CardContent } from "@/components/ui/card";

export function Testimonials() {
	return (
		<section id="testimonials" className="section__container">
			<h2 className="section__title">Depoimentos</h2>
			<p className="section__subtitle">O que meus clientes dizem</p>
			<Card>
				<CardContent>Conteúdo da section Testimonials</CardContent>
			</Card>
		</section>
	);
}
