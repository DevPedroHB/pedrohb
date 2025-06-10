import { Card, CardContent } from "@/components/ui/card";
import type { routing } from "@/i18n/routing";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { SignInForm } from "./components/sign-in-form";

interface ISignIn {
	params: Promise<{
		locale: (typeof routing.locales)[number];
	}>;
}

export async function generateMetadata({ params }: ISignIn): Promise<Metadata> {
	const { locale } = await params;
	const t = await getTranslations({ locale, namespace: "app.sign_in" });

	return {
		title: t("title"),
	};
}

export default async function SignIn() {
	const t = await getTranslations("app.sign_in");

	return (
		<main className="w-full max-w-sm md:max-w-3xl">
			<div className="flex flex-col gap-6">
				<Card className="p-0 overflow-hidden">
					<CardContent className="grid md:grid-cols-2 p-0">
						<SignInForm />
						<div className="hidden md:block relative bg-muted">
							<img
								src="/images/auth.jpg"
								alt="Mesa com xícara de café, laptop mostrando gráfico de crescimento e luminária acesa em ambiente escuro"
								className="absolute inset-0 dark:brightness-[0.2] dark:grayscale w-full h-full object-cover"
							/>
						</div>
					</CardContent>
				</Card>
				<div className="text-muted-foreground *:[a]:hover:text-primary text-xs text-center *:[a]:underline *:[a]:underline-offset-4 text-balance">
					{t.rich("terms_and_polices", {
						terms_of_service: (chunks) => (
							<Link href="/terms-of-service">{chunks}</Link>
						),
						privacy_policy: (chunks) => (
							<Link href="/privacy-policy">{chunks}</Link>
						),
					})}
				</div>
			</div>
		</main>
	);
}
