import { UniqueEntityID } from "@/core/entities/unique-entity-id";
import {
	type ISession,
	Session,
} from "@/domain/account/enterprise/entities/session";
import { faker } from "@faker-js/faker";
import { makeUser } from "./make-user";

export function makeSession(
	override: Partial<ISession> = {},
	id?: UniqueEntityID,
) {
	const user = makeUser();

	const session = Session.create(
		{
			sessionToken: faker.string.uuid(),
			expiresAt: faker.date.future(),
			createdAt: faker.date.past({ refDate: user.createdAt }),
			userId: user.id,
			...override,
		},
		id,
	);

	return {
		user,
		session,
	};
}
