import type { Card } from "../Card";
import { Format } from "../format/Format";
import type { BanState } from "./BanState";
import { DefaultBanState } from "./BanState";
import type { BanlistInfo } from "./BanlistInfo";

export class BanlistService {
	/**
	 * Formats which have a banlist. See {@link BanlistInfo}.
	 */
	private static readonly BANLIST_FORMATS: Set<Format> = new Set([
		Format.OCG,
		Format.TCG,
		Format.GOAT,
	]);

	/**
	 * Checks if a format has an explicit banlist.
	 *
	 * @param format Format to check.
	 * @return if the format has a banlist.
	 */
	hasBanlist(format: Format): boolean {
		return BanlistService.BANLIST_FORMATS.has(format);
	}

	/**
	 * Gets the {@link BanState} of a card by format.
	 *
	 * @param card Card to check.
	 * @param format Format to check against. May be null for no format.
	 * @return BanState for the card in the format.
	 */
	getBanStateByFormat(card: Card, format: Format | null): BanState {
		// If no format is specified, it is unknown -> unlimited
		if (format == null) {
			return DefaultBanState.UNLIMITED;
		}

		// If the format is not listed, it is not allowed -> banned
		if (!card.formats.includes(format)) {
			return DefaultBanState.BANNED;
		}

		// If the format is listed, but no explicit banlist -> unlimited
		if (!this.hasBanlist(format)) {
			return DefaultBanState.UNLIMITED;
		}
		// If a ban state is set -> use ban state
		return card.banlist[format as keyof BanlistInfo];
	}
}
