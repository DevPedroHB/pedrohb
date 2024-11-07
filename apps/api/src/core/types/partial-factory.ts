import { UniqueEntityID } from "../entities/unique-entity-id";

export type TPartialFactory<T> = Partial<T> & {
	id?: UniqueEntityID;
};
