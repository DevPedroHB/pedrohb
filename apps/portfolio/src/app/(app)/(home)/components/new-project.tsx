import { Card, CardContent } from "@/components/ui/card";

export function NewProject() {
	return (
		<section id="new-project" className="section__container">
			<h2 className="section__title">Você tem um novo projeto</h2>
			<p className="section__subtitle">
				Entre em contato comigo agora e ganhe 30% de desconto no seu novo
				projeto.
			</p>
			<Card>
				<CardContent>Conteúdo da section NewProject</CardContent>
			</Card>
		</section>
	);
}
