import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

interface IUserProfile {
	params: Promise<{
		userId: string;
	}>;
}

export async function generateMetadata({
	params,
}: IUserProfile): Promise<Metadata> {
	const { userId } = await params;

	return {
		title: `Perfil de ${userId}`,
	};
}

export default async function UserProfile({ params }: IUserProfile) {
	const { userId } = await params;

	return (
		<main className="main__container">
			<section id="user-profile" className="section__container">
				<h2 className="section__title">Perfil de {userId}</h2>
				<p className="section__subtitle">
					Veja as informações e atividades de {userId}
				</p>
				<Card>
					<CardContent>
						Conteúdo da section da página de perfil de {userId}
					</CardContent>
				</Card>
			</section>
		</main>
	);
}
