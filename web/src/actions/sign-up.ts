"use server";

import { api } from "@/libs/ky";
import type { User } from "@/types/user";
import type { AdapterUser } from "next-auth/adapters";

interface SignUpResponse {
	user: User;
}

export async function signUp({
	name,
	email,
	password,
	avatarUrl,
	birthdate,
	emailVerifiedAt,
}: AdapterUser) {
	try {
		const response = await api.post("users", {
			json: {
				name,
				email,
				password,
				avatarUrl,
				birthdate,
				emailVerifiedAt,
			},
		});

		if (!response.ok) {
			console.log(response.json());

			throw new Error("Não foi possível cadastrar o usuário.");
		}

		return response.json<SignUpResponse>();
	} catch (error) {
		console.log(error);

		throw new Error("Não foi possível se conectar com a API.");
	}
}
