import { SignInForm } from "@/app/[locale]/auth/sign-in/components/sign-in-form";
import { InterceptedDialog } from "@/components/intercepted-dialog";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function SignIn() {
	const t = await getTranslations("app.sign_in");

	return (
		<InterceptedDialog className="grid md:grid-cols-2 p-0 w-full max-w-sm md:max-w-3xl overflow-hidden">
			<div className="flex flex-col gap-2 p-6 md:p-8">
				<SignInForm variant="dialog" />
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
			<div className="hidden md:block relative bg-muted">
				<img
					src="/images/auth.jpg"
					alt="Mesa com xícara de café, laptop mostrando gráfico de crescimento e luminária acesa em ambiente escuro"
					className="absolute inset-0 dark:brightness-[0.2] dark:grayscale w-full h-full object-cover"
				/>
			</div>
		</InterceptedDialog>
	);
}
