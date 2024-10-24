import "next-auth";
import type { User } from "./user";

declare module "next-auth" {
	// export interface User extends ApiUser {}

	interface Session {
		user: User;
	}
}
