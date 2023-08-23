import type {
	Deck,
	DeckFileService,
	DeckService,
	DeckUriEncodingService,
} from "@/core/lib";
import { getLogger } from "@/core/lib";

export class DeckUrlController {
	static readonly #logger = getLogger(DeckUrlController);

	// Note that this parameter may be supplied by a third party, so the format should not be changed.
	static readonly #PARAM_ENCODED_URI_DECK = "y";

	/**
	 * @deprecated
	 */
	static readonly #PARAM_LEGACY_ENCODED_URI_DECK = "e";
	/**
	 * @deprecated
	 */
	static readonly #PARAM_REMOTE_DECK = "u";

	readonly #deckService: DeckService;
	readonly #deckUriEncodingService: DeckUriEncodingService;
	readonly #deckFileService: DeckFileService;

	constructor(
		deckService: DeckService,
		deckUriEncodingService: DeckUriEncodingService,
		deckFileService: DeckFileService
	) {
		this.#deckService = deckService;
		this.#deckUriEncodingService = deckUriEncodingService;
		this.#deckFileService = deckFileService;
	}

	/**
	 * Loads referenced deck from current URL, if any exist.
	 *
	 * @param url current URL.
	 * @return Parsed deck or null if none is found.
	 */
	async loadUriDeck(url: URL): Promise<Deck | null> {
		// Load deck file from a remote URL
		const remoteUrlValue = url.searchParams.get(
			DeckUrlController.#PARAM_REMOTE_DECK
		);
		if (remoteUrlValue != null) {
			const importResult = await this.#deckFileService.fromRemoteFile(
				new URL(location.toString()),
				new URL(remoteUrlValue)
			);
			if (importResult.missing.length > 0) {
				DeckUrlController.#logger.warn(
					`Could not read ${importResult.missing.length} cards in remote deck.`
				);
			}
			return importResult.deck;
		}

		// Load encoded URI deck
		const uriEncodedDeck = url.searchParams.get(
			DeckUrlController.#PARAM_ENCODED_URI_DECK
		);
		if (uriEncodedDeck != null) {
			return this.#deckUriEncodingService.fromUrlQueryParamValue(
				uriEncodedDeck
			);
		}

		// Load legacy encoded URI deck
		const legacyUriEncodedDeck = url.searchParams.get(
			DeckUrlController.#PARAM_LEGACY_ENCODED_URI_DECK
		);
		if (legacyUriEncodedDeck != null) {
			return this.#deckUriEncodingService.fromLegacyUrlQueryParamValue(
				legacyUriEncodedDeck
			);
		}

		return Promise.resolve(null);
	}

	/**
	 * Encodes a deck into a shareable URL.
	 *
	 * @param deck Deck to encode.
	 * @return Shareable link.
	 */
	getShareLink(deck: Deck): URL {
		const url = new URL(location.href);
		if (this.#deckService.getAllCards(deck).length > 0) {
			url.searchParams.set(
				DeckUrlController.#PARAM_ENCODED_URI_DECK,
				this.#deckUriEncodingService.toUrlQueryParamValue(deck)
			);
		}
		return url;
	}
}
