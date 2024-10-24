import { User } from "@/domain/account/enterprise/entities/user";

export class UserPresenter {
	static toHTTP(user: User) {
		return {
			id: user.id.id,
			name: user.name,
			email: user.email,
			avatarUrl: user.avatarUrl,
			birthdate: user.birthdate,
			role: user.role,
			emailVerifiedAt: user.emailVerifiedAt,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}
}
