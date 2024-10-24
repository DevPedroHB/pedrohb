import NextAuth from "next-auth";
import type { Adapter } from "next-auth/adapters";
import GitHub from "next-auth/providers/github";
import { ApiAdapter } from "./adapters/api-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
	adapter: ApiAdapter as Adapter,
	providers: [GitHub],
});
