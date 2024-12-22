import { asConstant } from "../util";

export interface Currency {
	/**
	 * See {@link Intl.NumberFormatOptions#currency}.
	 */
	readonly id: string;
}

export const DefaultCurrency: Record<string, Currency> = {
	USD: asConstant({
		id: "USD",
	}),
	EUR: asConstant({
		id: "EUR",
	}),
} as const;
