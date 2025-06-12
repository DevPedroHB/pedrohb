"use client";

import { signInCredentialsAction } from "@/actions/sign-in-credentials-action";
import { GitHub } from "@/components/icons/github";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { actionClientErrorHandler } from "@/functions/action-client-error-handler";
import { cn } from "@/functions/cn";
import { signInSchema } from "@/types/schemas/sign-in-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useHookFormAction } from "@next-safe-action/adapter-react-hook-form/hooks";
import { Discord, Google } from "@ridemountainpig/svgl-react";
import { type VariantProps, cva } from "class-variance-authority";
import { useTranslations } from "next-intl";
import Link from "next/link";
import type { ComponentProps } from "react";
import { toast } from "sonner";

const buttonVariants = cva("flex flex-col gap-6", {
	variants: {
		variant: {
			page: "p-6 md:p-8",
			dialog: "",
		},
	},
	defaultVariants: {
		variant: "page",
	},
});

interface ISignInForm
	extends ComponentProps<"form">,
		VariantProps<typeof buttonVariants> {}

export function SignInForm({ variant, className, ...props }: ISignInForm) {
	const t = useTranslations("app.sign_in.form");

	const { form, handleSubmitWithAction, resetFormAndAction } =
		useHookFormAction(signInCredentialsAction, zodResolver(signInSchema), {
			actionProps: {
				onError({ error }) {
					actionClientErrorHandler({ error });
				},
				onNavigation() {
					toast.success("Seja bem-vindo de volta! :)");

					resetFormAndAction();
				},
			},
			formProps: {
				defaultValues: {
					email: "",
					password: "",
				},
			},
		});

	return (
		<Form {...form}>
			<form
				onSubmit={handleSubmitWithAction}
				className={cn(buttonVariants({ variant }), className)}
				{...props}
			>
				<div className="flex flex-col items-center text-center">
					<h1 className="font-bold text-2xl">{t("title")}</h1>
					<p className="text-muted-foreground text-balance">{t("subtitle")}</p>
				</div>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>{t("email.label")}</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder={t("email.placeholder")}
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="password"
					render={({ field }) => (
						<FormItem>
							<FormLabel className="justify-between">
								{t("password.label")}{" "}
								<Link
									href="/auth/forgot-password"
									className="hover:underline underline-offset-2"
								>
									{t("forgot_password")}
								</Link>
							</FormLabel>
							<FormControl>
								<Input
									type="password"
									placeholder={t("password.placeholder")}
									required
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" className="w-full">
					{t("submit")}
				</Button>
				<div className="after:top-1/2 after:z-0 after:absolute relative after:inset-0 after:flex after:items-center after:border-t after:border-border text-sm text-center">
					<span className="z-10 relative bg-card px-2 rounded text-muted-foreground">
						{t("or_social")}
					</span>
				</div>
				<div className="gap-4 grid grid-cols-3">
					<Button type="button" variant="outline" className="w-full">
						<Google className="size-6" />
					</Button>
					<Button type="button" variant="outline" className="w-full">
						<GitHub className="size-6" />
					</Button>
					<Button type="button" variant="outline" className="w-full">
						<Discord className="size-6" />
					</Button>
				</div>
				<div className="text-sm text-center">
					{t.rich("not_have_account", {
						sign_up: (chunks) => (
							<Link
								href="/auth/sign-up"
								className="underline underline-offset-4"
							>
								{chunks}
							</Link>
						),
					})}
				</div>
			</form>
		</Form>
	);
}
