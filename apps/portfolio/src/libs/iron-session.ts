import { keys } from "@/constants/keys";
import { env } from "@pedrohb/env";
import type { SessionOptions } from "iron-session";

export interface SessionData {
	token: string;
}

export const sessionOptions: SessionOptions = {
	password: env.AUTH_SECRET,
	cookieName: keys.TOKEN,
	ttl: 60 * 60 * 24 * 7, // 7 days
	cookieOptions: {
		secure: env.NODE_ENV === "production",
		httpOnly: true,
		sameSite: "lax",
		maxAge: 60 * 60 * 24 * 7, // 7 days
	},
};
