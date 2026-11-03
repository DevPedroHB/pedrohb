import { CNPJ } from "./cnpj.js";

const validCnpj = CNPJ.generate({ formatted: true });

describe("CNPJ", () => {
	it("should creates a CNPJ and exposes it in formatted form", () => {
		const cnpj = CNPJ.create(validCnpj);

		expect(cnpj).toBeInstanceOf(CNPJ);
		expect(cnpj.cnpj).toBe(validCnpj);
		expect(cnpj.toJSON()).toEqual({ cnpj: validCnpj });
	});

	it("should throws INVALID_CNPJ when given an invalid value", () => {
		expect(() => CNPJ.create("123")).toThrow(
			expect.objectContaining({
				code: "INVALID_CNPJ",
				params: { cnpj: "123" },
			}),
		);
	});
});
