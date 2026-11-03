import { ValueObject } from "./value-object.js";

export type AddressProps = {
	city?: string | null;
	complement?: string | null;
	country: string;
	district?: string | null;
	number?: string | null;
	state?: string | null;
	street?: string | null;
	zipCode?: string | null;
};

export class Address extends ValueObject<AddressProps> {
	private constructor(props: AddressProps) {
		super(props);
	}

	public get city() {
		return this.props.city;
	}

	public get complement() {
		return this.props.complement;
	}

	public get country() {
		return this.props.country;
	}

	public get district() {
		return this.props.district;
	}

	public get number() {
		return this.props.number;
	}

	public get state() {
		return this.props.state;
	}

	public get street() {
		return this.props.street;
	}

	public get zipCode() {
		return this.props.zipCode;
	}

	public toJSON() {
		return {
			city: this.city,
			complement: this.complement,
			country: this.country,
			district: this.district,
			number: this.number,
			state: this.state,
			street: this.street,
			zipCode: this.zipCode,
		};
	}

	public static create(props: AddressProps) {
		return new Address({
			...props,
			city: props.city ?? null,
			complement: props.complement ?? null,
			district: props.district ?? null,
			number: props.number ?? null,
			state: props.state ?? null,
			street: props.street ?? null,
			zipCode: props.zipCode ?? null,
		});
	}
}
