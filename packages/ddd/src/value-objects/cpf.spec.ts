import { CPF } from "./cpf.js";

const validCpf = CPF.generate({ formatted: true });

describe("CPF", () => {
	it("should creates a CPF and exposes it in formatted form", () => {
		const cpf = CPF.create(validCpf);

		expect(cpf).toBeInstanceOf(CPF);
		expect(cpf.cpf).toBe(validCpf);
		expect(cpf.toJSON()).toEqual({ cpf: validCpf });
	});

	it("should throws INVALID_CPF when given an invalid value", () => {
		expect(() => CPF.create("123")).toThrow(
			expect.objectContaining({
				code: "INVALID_CPF",
				params: { cpf: "123" },
			}),
		);
	});
});
