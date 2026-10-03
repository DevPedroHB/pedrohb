import { InvalidParamDelimitersError } from "#/errors/invalid-param-delimiters-error.js";
import { createParamPlaceholder } from "./create-param-placeholder.js";

describe("createParamPlaceholder", () => {
	const regex = createParamPlaceholder();

	it("should match all placeholders with the default delimiters", () => {
		const matches = "O usuário {nome} do item {id} não foi encontrado".match(
			regex,
		);

		expect(matches).toEqual(["{nome}", "{id}"]);
	});

	it("should capture the param name without the delimiters", () => {
		const params = [
			..."O usuário {nome} do item {id} não foi encontrado".matchAll(regex),
		].map((match) => match[1]);

		expect(params).toEqual(["nome", "id"]);
	});

	it("should match placeholders with custom delimiters", () => {
		const regex = createParamPlaceholder({ open: "[", close: "]" });
		const matches = "O usuário [nome] não foi encontrado".match(regex);

		expect(matches).toEqual(["[nome]"]);
	});

	it("should escape special regex characters in the delimiters", () => {
		const regex = createParamPlaceholder({ open: "(", close: ")" });
		const matches = "Erro (id) inesperado".match(regex);

		expect(matches).toEqual(["(id)"]);
	});

	it("should throw a TypeError when a delimiter is empty", () => {
		expect(() => createParamPlaceholder({ open: "", close: "}" })).toThrow(
			InvalidParamDelimitersError,
		);

		expect(() => createParamPlaceholder({ open: "{", close: "" })).toThrow(
			InvalidParamDelimitersError,
		);
	});
});
