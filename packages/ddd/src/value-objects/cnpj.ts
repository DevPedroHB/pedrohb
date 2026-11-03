import { type CnpjGenerateOptions, cnpj } from "cpf-cnpj-validator";
import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export type CNPJProps = {
	cnpj: string;
};

export class CNPJ extends ValueObject<CNPJProps> {
	private constructor(props: CNPJProps) {
		super(props);
	}

	public get cnpj() {
		return this.props.cnpj;
	}

	public toJSON() {
		return {
			cnpj: this.cnpj,
		};
	}

	public static format(value: string) {
		return cnpj.format(value);
	}

	public static generate(options?: boolean | CnpjGenerateOptions) {
		return cnpj.generate(options);
	}

	public static isValid(value: string, strict?: boolean) {
		return cnpj.isValid(value, strict);
	}

	public static strip(value: string, strict?: boolean) {
		return cnpj.strip(value, strict);
	}

	public static verifierDigit(digits: string) {
		return cnpj.verifierDigit(digits);
	}

	public static create(cnpj = CNPJ.generate()) {
		if (!CNPJ.isValid(cnpj)) {
			throw new DDDError("INVALID_CNPJ", {
				params: {
					cnpj,
				},
				cause: cnpj,
			});
		}

		return new CNPJ({
			cnpj: CNPJ.format(cnpj),
		});
	}
}
