import { InvalidParamDelimitersError } from "#/errors/invalid-param-delimiters-error.js";
import { extractPlaceholderNames } from "./extract-placeholder-names.js";

describe("extractPlaceholderNames", () => {
	it("should extract the placeholder names with the default delimiters", () => {
		expect(
			extractPlaceholderNames("Usuário {id} não encontrado em {table}"),
		).toStrictEqual(new Set(["id", "table"]));
	});

	it("should return an empty set for messages without placeholders", () => {
		expect(extractPlaceholderNames("Token inválido")).toStrictEqual(new Set());
	});

	it("should trim names, ignore empty ones and deduplicate", () => {
		expect(extractPlaceholderNames("{ id } {} {   } {id} {key}")).toStrictEqual(
			new Set(["id", "key"]),
		);
	});

	it("should support custom delimiters", () => {
		expect(
			extractPlaceholderNames("Rota [route] {ignored}", {
				open: "[",
				close: "]",
			}),
		).toStrictEqual(new Set(["route"]));
	});

	it("should throw InvalidParamDelimitersError for empty delimiters", () => {
		expect(() =>
			extractPlaceholderNames("{id}", { open: "", close: "}" }),
		).toThrow(InvalidParamDelimitersError);
	});
});
