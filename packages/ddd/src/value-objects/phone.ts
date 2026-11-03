import {
	type CountryCode,
	type Examples,
	findPhoneNumbersInText,
	formatIncompletePhoneNumber,
	getCountries,
	getCountryCallingCode,
	getExampleNumber,
	getExtPrefix,
	isPossiblePhoneNumber,
	isSupportedCountry,
	isValidPhoneNumber,
	type PhoneNumber,
	parseDigits,
	parseIncompletePhoneNumber,
	parsePhoneNumberCharacter,
	parsePhoneNumberFromString,
	parsePhoneNumberWithError,
	searchNumbers,
	searchParsedNumbers,
	searchPhoneNumbersInText,
	validatePhoneNumberLength,
} from "libphonenumber-js";
import { DDDError } from "#/errors/ddd-error.js";
import { ValueObject } from "./value-object.js";

export type PhoneProps = {
	carrierCode?: string;
	country?: CountryCode;
	countryCallingCode: string;
	ext?: string;
	nationalNumber: string;
	number: string;
};

export class Phone extends ValueObject<PhoneProps> {
	private constructor(props: PhoneProps) {
		super(props);
	}

	public get carrierCode() {
		return this.props.carrierCode;
	}

	public get country() {
		return this.props.country;
	}

	public get countryCallingCode() {
		return this.props.countryCallingCode;
	}

	public get ext() {
		return this.props.ext;
	}

	public get nationalNumber() {
		return this.props.nationalNumber;
	}

	public get number() {
		return this.props.number;
	}

	public toJSON() {
		return {
			carrierCode: this.carrierCode,
			country: this.country,
			countryCallingCode: this.countryCallingCode,
			ext: this.ext,
			nationalNumber: this.nationalNumber,
			number: this.number,
		};
	}

	public static findPhoneNumbersInText(
		text: string,
		options:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
					extended?: boolean;
			  } = "BR",
	) {
		return findPhoneNumbersInText(text, options);
	}

	public static formatIncompletePhoneNumber(
		number: string,
		countryCode: CountryCode = "BR",
	) {
		return formatIncompletePhoneNumber(number, countryCode);
	}

	public static getCountries() {
		return getCountries();
	}

	public static getCountryCallingCode(countryCode: CountryCode) {
		return getCountryCallingCode(countryCode);
	}

	public static getExampleNumber(country: CountryCode, examples: Examples) {
		return getExampleNumber(country, examples);
	}

	public static getExtPrefix(countryCode: CountryCode) {
		return getExtPrefix(countryCode);
	}

	public static isPossiblePhoneNumber(
		text: string,
		defaultCountry:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
			  } = "BR",
	) {
		return isPossiblePhoneNumber(text, defaultCountry);
	}

	public static isSupportedCountry(countryCode: string | CountryCode) {
		return isSupportedCountry(countryCode);
	}

	public static isValidPhoneNumber(
		text: string,
		defaultCountry:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
			  } = "BR",
	) {
		return isValidPhoneNumber(text, defaultCountry);
	}

	public static parseDigits(character: string) {
		return parseDigits(character);
	}

	public static parseIncompletePhoneNumber(text: string) {
		return parseIncompletePhoneNumber(text);
	}

	public static parsePhoneNumberCharacter(
		character: string,
		prevParsedCharacters?: string,
		eventListener?: (eventName: "end") => void,
	) {
		return parsePhoneNumberCharacter(
			character,
			prevParsedCharacters,
			eventListener,
		);
	}

	public static parsePhoneNumberFromString(
		text: string,
		defaultCountry:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
					extract?: boolean;
			  } = "BR",
	) {
		return parsePhoneNumberFromString(text, defaultCountry);
	}

	public static parsePhoneNumberWithError(
		text: string,
		defaultCountry:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
					extract?: boolean;
			  } = "BR",
	) {
		return parsePhoneNumberWithError(text, defaultCountry);
	}

	public static searchNumbers(text: string, options: CountryCode = "BR") {
		return searchNumbers(text, options);
	}

	public static searchParsedNumbers(
		text: string,
		options:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
			  } = "BR",
	) {
		return searchParsedNumbers(text, options);
	}

	public static searchPhoneNumbersInText(
		text: string,
		options:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
					extended?: boolean;
			  } = "BR",
	) {
		return searchPhoneNumbersInText(text, options);
	}

	public static validatePhoneNumberLength(
		text: string,
		defaultCountry:
			| CountryCode
			| {
					defaultCountry?: CountryCode;
					defaultCallingCode?: string;
			  } = "BR",
	) {
		return validatePhoneNumberLength(text, defaultCountry);
	}

	public static create(phone: string, countryCode: CountryCode = "BR") {
		let phoneNumber: PhoneNumber;

		try {
			phoneNumber = Phone.parsePhoneNumberWithError(phone, countryCode);
		} catch (error) {
			throw new DDDError("INVALID_PHONE", {
				params: {
					phone,
				},
				cause: error,
			});
		}

		if (!phoneNumber.isValid()) {
			throw new DDDError("INVALID_PHONE", {
				params: {
					phone,
				},
				cause: phoneNumber,
			});
		}

		return new Phone({
			carrierCode: phoneNumber.carrierCode,
			country: phoneNumber.country,
			countryCallingCode: phoneNumber.countryCallingCode,
			ext: phoneNumber.ext,
			nationalNumber: phoneNumber.nationalNumber,
			number: phoneNumber.number,
		});
	}
}
