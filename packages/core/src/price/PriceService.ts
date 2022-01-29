import { injectable } from "inversify";
import type { Card } from "../card/Card";
import type { Vendor } from "./Vendor";
import type { Currency } from "./Currency";
import { difference, sum } from "lodash";

export interface PriceLookupResult {
	price: number;
	missing: Card[];
}

@injectable()
export class PriceService {
	/**
	 * Formats a price for its currency.
	 *
	 * @param value Value to format.
	 * @param currency Currency to format for.
	 * @return formatted price.
	 */
	formatPrice(value: number, currency: Currency): string {
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency.id,
			minimumFractionDigits: currency.fractionDigits,
			maximumFractionDigits: currency.fractionDigits,
		}).format(value);
	}

	/**
	 * Gets the price of the card(s) for the given vendor and currency, using the sum of all existing prices.
	 *
	 * @param cards Cards to check.
	 * @param vendor Vendor to get the price for.
	 * @return Object containing total sum for this vendor's currency, as well as a list of cards for which no price
	 * could be found.
	 */
	getPrice(cards: Card[], vendor: Vendor): PriceLookupResult {
		const missing: Card[] = cards.filter(
			(card) => !this.#hasPrice(card, vendor)
		);
		const price = sum(
			difference(cards, missing).map((card) =>
				this.#getCardPrice(card, vendor)
			)
		);
		return { price, missing };
	}

	#hasPrice(card: Card, vendor: Vendor): boolean {
		return card.prices.has(vendor);
	}

	#getCardPrice(card: Card, vendor: Vendor): number {
		if (!this.#hasPrice(card, vendor)) {
			throw new TypeError(
				`No price exists for this vendor: ${vendor.id}`
			);
		}
		return card.prices.get(vendor)!;
	}
}
