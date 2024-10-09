import { locales } from "@/constants/locales";
import { createSharedPathnamesNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
	locales,
	defaultLocale: locales[0],
});

export const { Link, redirect, usePathname, useRouter, permanentRedirect } =
	createSharedPathnamesNavigation(routing);
