import { Address } from "./address.js";

const props = {
	city: "São Paulo",
	complement: "Apto 12",
	country: "Brasil",
	district: "Centro",
	number: "123",
	state: "SP",
	street: "Rua das Flores",
	zipCode: "01000-000",
};

describe("Address", () => {
	it("should create an address and expose its properties", () => {
		const address = Address.create(props);

		expect(address).toBeInstanceOf(Address);
		expect(address.city).toBe(props.city);
		expect(address.complement).toBe(props.complement);
		expect(address.country).toBe(props.country);
		expect(address.district).toBe(props.district);
		expect(address.number).toBe(props.number);
		expect(address.state).toBe(props.state);
		expect(address.street).toBe(props.street);
		expect(address.zipCode).toBe(props.zipCode);
	});

	it.each([undefined, null])(
		"should normalize a missing or null complement to null (%s)",
		(complement) => {
			const address = Address.create({ ...props, complement });

			expect(address.complement).toBeNull();
			expect(address.toJSON().complement).toBeNull();
		},
	);

	it("should serialize all properties to JSON", () => {
		const address = Address.create(props);

		expect(address.toJSON()).toEqual(props);
	});
});
