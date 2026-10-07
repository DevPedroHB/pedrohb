import { BaseError, defineErrorCatalog } from "@pedrohb/errors";
import { DDDError } from "./ddd-error.js";
import { isDDDError } from "./is-ddd-error.js";

describe("isDDDError", () => {
	const OTHER_CODES = defineErrorCatalog({ OTHER_ERROR: "Outro erro." });

	class OtherError extends BaseError<typeof OTHER_CODES, "OTHER_ERROR"> {
		public constructor() {
			super(OTHER_CODES.OTHER_ERROR);
		}
	}

	it("should return true for a DDDError instance", () => {
		expect(isDDDError(new DDDError("INTERNAL_SERVER_ERROR"))).toBe(true);
	});

	it("should return false for a BaseError that is not a DDDError", () => {
		expect(isDDDError(new OtherError())).toBe(false);
	});

	it("should return false for a native Error", () => {
		expect(isDDDError(new Error("Mensagem do erro."))).toBe(false);
	});

	it("should return false for non-Error values", () => {
		expect(isDDDError(null)).toBe(false);
		expect(isDDDError(undefined)).toBe(false);
		expect(isDDDError("Mensagem do erro.")).toBe(false);
		expect(isDDDError({})).toBe(false);
	});
});
