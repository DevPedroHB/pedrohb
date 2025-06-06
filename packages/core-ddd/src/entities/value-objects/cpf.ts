import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { ValueObject } from "../value-object";

/**
 * Representa um objeto de valor para CPF (Cadastro de Pessoa Física),
 * com validação, formatação e geração automática.
 */
export class CPF extends ValueObject {
	/**
	 * CPF formatado (com pontos e hífen).
	 */
	public readonly cpf: string;

	private constructor(cpf: string) {
		super();

		this.cpf = cpf;
	}

	/**
	 * Retorna o valor primitivo do CPF.
	 * @returns CPF como string formatada.
	 */
	public toValue(): string {
		return this.cpf;
	}

	/**
	 * Remove todos os caracteres não numéricos de um CPF.
	 * @param cpf CPF a ser limpo.
	 * @returns String contendo apenas os dígitos numéricos.
	 */
	public static strip(cpf: string): string {
		return cpf.replace(/\D+/g, "");
	}

	/**
	 * Formata um CPF não formatado (apenas números) no formato XXX.XXX.XXX-XX.
	 * @param cpf CPF não formatado (11 dígitos).
	 * @returns CPF formatado.
	 */
	public static format(cpf: string): string {
		return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
	}

	/**
	 * Verifica se um CPF é válido segundo a regra de dígitos verificadores.
	 * @param cpf CPF limpo (apenas números).
	 * @returns `true` se válido, `false` caso contrário.
	 */
	public static isValid(cpf: string): boolean {
		if (!/^[0-9]{11}$/.test(cpf)) {
			return false;
		}

		if (/^([0-9])\1{10}$/.test(cpf)) {
			return false;
		}

		const digits = cpf.split("").map((d) => Number.parseInt(d, 10));

		const calcCheck = (count: number, weightStart: number): number => {
			let sum = 0;

			for (let i = 0; i < count; i++) {
				sum += digits[i] * (weightStart - i);
			}

			const mod = sum % 11;

			return mod < 2 ? 0 : 11 - mod;
		};

		const d1 = calcCheck(9, 10);
		if (d1 !== digits[9]) {
			return false;
		}

		const d2 = calcCheck(10, 11);

		if (d2 !== digits[10]) {
			return false;
		}

		return true;
	}

	/**
	 * Gera um número de CPF válido.
	 * @param formatted Se `true`, retorna o CPF formatado; caso contrário, apenas os números.
	 * @returns CPF válido como string.
	 */
	public static generate(formatted = false): string {
		const randomDigits = Array.from({ length: 9 }, () =>
			Math.floor(Math.random() * 10),
		);

		const calcCheck = (digits: number[], weightStart: number): number => {
			const sum = digits.reduce(
				(acc, d, idx) => acc + d * (weightStart - idx),
				0,
			);
			const mod = sum % 11;

			return mod < 2 ? 0 : 11 - mod;
		};

		const d1 = calcCheck(randomDigits, 10);
		const d2 = calcCheck([...randomDigits, d1], 11);
		const full = [...randomDigits, d1, d2].join("");

		return formatted ? CPF.format(full) : full;
	}

	/**
	 * Cria uma instância de `CPF`, validando e formatando o valor fornecido.
	 * Se nenhum valor for fornecido, um novo CPF válido é gerado automaticamente.
	 * @param cpf CPF fornecido ou gerado automaticamente.
	 * @throws {InvalidCredentialsError} Se o CPF fornecido for inválido.
	 * @returns Instância de `CPF` válida.
	 */
	public static create(cpf = CPF.generate()): CPF {
		const strippedCpf = CPF.strip(cpf);

		if (!CPF.isValid(strippedCpf)) {
			throw new InvalidCredentialsError("CPF fornecido é inválido.");
		}

		const formatted = CPF.format(strippedCpf);

		return new CPF(formatted);
	}
}
