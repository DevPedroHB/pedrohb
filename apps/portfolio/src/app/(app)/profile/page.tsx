import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Perfil",
};

export default async function Profile() {
	return (
		<main className="main__container">
			<section id="profile" className="section__container">
				<h2 className="section__title">Meu Perfil</h2>
				<p className="section__subtitle">
					Visualize e edite suas informações pessoais
				</p>
				<Card>
					<CardContent>Conteúdo da section da página de perfil</CardContent>
				</Card>
			</section>
		</main>
	);
}
