import { deepFreeze } from "lightdash";

export interface Currency {
	/**
	 * See {@link Intl.NumberFormatOptions#currency}.
	 */
	readonly id: string;

	readonly name: string;

	readonly fractionDigits: number;
}

// Values from https://api.exchangeratesapi.io/latest?base=USD
const DefaultCurrency: Record<string, Currency> = {
	USD: {
		id: "USD",
		name: "US Dollar",
		fractionDigits: 2,
	},
	EUR: {
		id: "EUR",
		name: "Euro",
		fractionDigits: 2,
	},
} as const;
deepFreeze(DefaultCurrency);
export { DefaultCurrency };
