import { Coordinates } from "./coordinates.js";

describe("Coordinates", () => {
	it("should creates coordinates, exposes their values, and serializes them", () => {
		const coordinates = Coordinates.create({
			latitude: 40.7128,
			longitude: -74.006,
		});

		expect(coordinates.latitude).toBe(40.7128);
		expect(coordinates.longitude).toBe(-74.006);
		expect(coordinates.toJSON()).toEqual({
			latitude: 40.7128,
			longitude: -74.006,
		});
	});

	it("should validates coordinate ranges and rejects non-finite values", () => {
		expect(Coordinates.validate({ latitude: 90, longitude: -180 })).toBe(true);
		expect(Coordinates.validate({ latitude: 90.1, longitude: 0 })).toBe(false);
		expect(Coordinates.validate({ latitude: 0, longitude: 180.1 })).toBe(false);
		expect(Coordinates.validate({ latitude: Number.NaN, longitude: 0 })).toBe(
			false,
		);
		expect(
			Coordinates.validate({
				latitude: 0,
				longitude: Number.POSITIVE_INFINITY,
			}),
		).toBe(false);
	});

	it("should rejects invalid coordinates when creating the value object", () => {
		expect(() => Coordinates.create({ latitude: 91, longitude: 0 })).toThrow(
			expect.objectContaining({ code: "INVALID_COORDINATES" }),
		);
	});

	it("should calculates the great-circle distance in kilometers", () => {
		const newYork = Coordinates.create({
			latitude: 40.7128,
			longitude: -74.006,
		});
		const london = { latitude: 51.5074, longitude: -0.1278 };

		expect(newYork.distanceTo(london)).toBeCloseTo(5_570, -1);
		expect(newYork.distanceTo(newYork.toJSON())).toBe(0);
	});
});
