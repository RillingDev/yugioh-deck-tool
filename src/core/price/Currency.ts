import { deepFreeze } from "lightdash";

export interface Currency {
	/**
	 * See {@link Intl.NumberFormatOptions#currency}.
	 */
	readonly id: string;
}

const DefaultCurrency: Record<string, Currency> = {
	USD: {
		id: "USD",
	},
	EUR: {
		id: "EUR",
	},
} as const;
deepFreeze(DefaultCurrency);
export { DefaultCurrency };
