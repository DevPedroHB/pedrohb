import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

const EARTH_RADIUS_KM = 6_371;
const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

export type CoordinatesProps = {
	latitude: number;
	longitude: number;
};

export class Coordinates extends ValueObject<CoordinatesProps> {
	private constructor(props: CoordinatesProps) {
		super(props);
	}

	public get latitude() {
		return this.props.latitude;
	}

	public get longitude() {
		return this.props.longitude;
	}

	public toJSON() {
		return {
			latitude: this.latitude,
			longitude: this.longitude,
		};
	}

	/**
	 * Distância em quilômetros pela fórmula de haversine.
	 */
	public distanceTo(other: CoordinatesProps) {
		const lat1 = toRadians(this.latitude);
		const lat2 = toRadians(other.latitude);
		const deltaLat = lat2 - lat1;
		const deltaLon = toRadians(other.longitude - this.longitude);
		const h =
			Math.sin(deltaLat / 2) ** 2 +
			Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
		const centralAngle = 2 * Math.asin(Math.min(1, Math.sqrt(h)));

		return EARTH_RADIUS_KM * centralAngle;
	}

	public static validate({ latitude, longitude }: CoordinatesProps) {
		return (
			Number.isFinite(latitude) &&
			Math.abs(latitude) <= 90 &&
			Number.isFinite(longitude) &&
			Math.abs(longitude) <= 180
		);
	}

	public static create(coordinates: CoordinatesProps) {
		if (!Coordinates.validate(coordinates)) {
			throw new DDDError("INVALID_COORDINATES", {
				params: {
					latitude: coordinates.latitude,
					longitude: coordinates.longitude,
				},
				cause: coordinates,
			});
		}

		return new Coordinates(coordinates);
	}
}
