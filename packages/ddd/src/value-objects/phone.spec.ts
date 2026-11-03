import { DDDError } from "#/errors/ddd-error.js";
import { Phone } from "./phone.js";

describe("Phone", () => {
	it("creates a value object from a valid phone number", () => {
		const phone = Phone.create("+55 11 91234-5678");

		expect(phone).toBeInstanceOf(Phone);
		expect(phone.number).toBe("+5511912345678");
		expect(phone.country).toBe("BR");
		expect(phone.countryCallingCode).toBe("55");
		expect(phone.nationalNumber).toBe("11912345678");
		expect(phone.toJSON()).toEqual({
			carrierCode: undefined,
			country: "BR",
			countryCallingCode: "55",
			ext: undefined,
			nationalNumber: "11912345678",
			number: "+5511912345678",
		});
	});

	it("uses the provided country to parse a national number", () => {
		const phone = Phone.create("202-555-0123", "US");

		expect(phone.number).toBe("+12025550123");
		expect(phone.country).toBe("US");
	});

	it("throws INVALID_PHONE when the input cannot be parsed", () => {
		expect.assertions(2);

		try {
			Phone.create("not a phone number");
		} catch (error) {
			expect(error).toBeInstanceOf(DDDError);
			expect((error as DDDError).code).toBe("INVALID_PHONE");
		}
	});

	it("throws INVALID_PHONE when the parsed number is invalid", () => {
		expect.assertions(2);

		try {
			Phone.create("+55 11 1234");
		} catch (error) {
			expect(error).toBeInstanceOf(DDDError);
			expect((error as DDDError).code).toBe("INVALID_PHONE");
		}
	});
});
