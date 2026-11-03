import { DDDError } from "#/errors/ddd-error.js";
import { Email } from "./email.js";

describe("Email", () => {
	it("should create an email value object", () => {
		const email = Email.create("person@example.com");

		expect(email.email).toBe("person@example.com");
		expect(email.toJSON()).toEqual({ email: "person@example.com" });
	});

	it("should validate email addresses", () => {
		expect(Email.isValid("person@example.com")).toBe(true);
		expect(Email.isValid("invalid-email")).toBe(false);
	});

	it("should throw DDDError for an invalid email", () => {
		expect(() => Email.create("invalid-email")).toThrow(DDDError);
	});
});
