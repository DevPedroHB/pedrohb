import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Início",
};

export default function Home() {
	return (
		<main className="flex flex-col justify-center items-center p-4 min-h-screen">
			<h1 className="font-extrabold text-4xl text-center text-balance tracking-tight scroll-m-20">
				Page Home
			</h1>
		</main>
	);
}
