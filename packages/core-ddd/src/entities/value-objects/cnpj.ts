import { InvalidCredentialsError } from "@/errors/invalid-credentials-error";
import { ValueObject } from "../value-object";

/**
 * Representa um objeto de valor para CNPJ (Cadastro Nacional da Pessoa Jurídica),
 * com validação, formatação e geração automática.
 */
export class CNPJ extends ValueObject {
	/**
	 * CNPJ formatado (com pontos, barra e hífen).
	 */
	public readonly cnpj: string;

	private constructor(cnpj: string) {
		super();

		this.cnpj = cnpj;
	}

	/**
	 * Retorna o valor primitivo do CNPJ.
	 * @returns CNPJ como string formatada.
	 */
	public toValue(): string {
		return this.cnpj;
	}

	/**
	 * Remove todos os caracteres não numéricos de um CNPJ.
	 * @param cnpj CNPJ a ser limpo.
	 * @returns String contendo apenas os dígitos numéricos.
	 */
	public static strip(cnpj: string): string {
		return cnpj.replace(/\D/g, "");
	}

	/**
	 * Formata um CNPJ não formatado (apenas números) no formato XX.XXX.XXX/XXXX-XX.
	 * @param cnpj CNPJ não formatado (14 dígitos).
	 * @returns CNPJ formatado.
	 */
	public static format(cnpj: string): string {
		return cnpj.replace(
			/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/,
			"$1.$2.$3/$4-$5",
		);
	}

	/**
	 * Verifica se um CNPJ é válido segundo a regra de dígitos verificadores.
	 * @param cnpj CNPJ limpo (apenas números).
	 * @returns `true` se válido, `false` caso contrário.
	 */
	public static isValid(cnpj: string): boolean {
		if (!/^[0-9]{14}$/.test(cnpj)) {
			return false;
		}

		if (/^(\d)\1{13}$/.test(cnpj)) {
			return false;
		}

		const calcDigit = (digits: string, weights: number[]): number => {
			const sum = digits
				.split("")
				.map((d, i) => Number.parseInt(d, 10) * weights[i])
				.reduce((a, b) => a + b, 0);
			const mod = sum % 11;

			return mod < 2 ? 0 : 11 - mod;
		};

		const base = cnpj.substr(0, 12);
		const digit1 = calcDigit(base, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
		const digit2 = calcDigit(
			base + digit1,
			[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
		);

		return cnpj.endsWith(`${digit1}${digit2}`);
	}

	/**
	 * Gera um número de CNPJ válido.
	 * @param formatted Se `true`, retorna o CNPJ formatado; caso contrário, apenas os números.
	 * @returns CNPJ válido como string.
	 */
	public static generate(formatted = false): string {
		const randomDigits = Array.from({ length: 12 }, () =>
			Math.floor(Math.random() * 10),
		).join("");

		const calcDigit = (digits: string, weights: number[]): number => {
			const sum = digits
				.split("")
				.map((d, i) => Number.parseInt(d, 10) * weights[i])
				.reduce((a, b) => a + b, 0);
			const mod = sum % 11;

			return mod < 2 ? 0 : 11 - mod;
		};

		const d1 = calcDigit(randomDigits, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
		const d2 = calcDigit(
			`${randomDigits}${d1}`,
			[6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2],
		);
		const full = `${randomDigits}${d1}${d2}`;

		return formatted ? CNPJ.format(full) : full;
	}

	/**
	 * Cria uma instância de `CNPJ`, validando e formatando o valor fornecido.
	 * Se nenhum valor for fornecido, um novo CNPJ válido é gerado automaticamente.
	 * @param cnpj CNPJ fornecido ou gerado automaticamente.
	 * @throws {InvalidCredentialsError} Se o CNPJ fornecido for inválido.
	 * @returns Instância de `CNPJ` válida.
	 */
	public static create(cnpj = CNPJ.generate()): CNPJ {
		const stripped = CNPJ.strip(cnpj);

		if (!CNPJ.isValid(stripped)) {
			throw new InvalidCredentialsError("CNPJ fornecido é inválido.");
		}

		const formatted = CNPJ.format(stripped);

		return new CNPJ(formatted);
	}
}
