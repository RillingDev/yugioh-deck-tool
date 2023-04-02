import type { Deck } from "./Deck";
import { DECK_PART_ARR } from "./Deck";
import type { CardDatabase } from "../card/CardDatabase";
import { FindCardBy } from "../card/CardDatabase";

import type { Card } from "../card/Card";
import { isEqual } from "lodash-es";
import type { DeckService } from "./DeckService";
import { inflateRaw } from "pako";
import type { EncodingService } from "../util/EncodingService";

export class DeckUriEncodingService {
	// A 32-bit integer is able to store all 8 digit passcodes
	// Note that currently we assume only little endian systems are used.
	static readonly #BLOCK_BYTE_SIZE = Uint32Array.BYTES_PER_ELEMENT;
	static readonly #LIMIT = 2 ** (DeckUriEncodingService.#BLOCK_BYTE_SIZE * 8); // Max number that can be stored in BLOCK_BYTE_SIZE bytes.

	static readonly #URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK: Uint8Array =
		new Uint8Array(DeckUriEncodingService.#BLOCK_BYTE_SIZE).fill(0);
	static readonly #URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN = true;

	static readonly #YDKE_URI_PROTOCOL = "ydke://";
	static readonly #YDKE_DELIMITER = "!";
	static readonly #YDKE_DELIMITER_COUNT = DECK_PART_ARR.length;

	readonly #cardDatabase: CardDatabase;
	readonly #deckService: DeckService;
	readonly #encodingService: EncodingService;

	constructor(
		cardDatabase: CardDatabase,
		deckService: DeckService,
		encodingService: EncodingService
	) {
		this.#deckService = deckService;
		this.#cardDatabase = cardDatabase;
		this.#encodingService = encodingService;
	}

	/**
	 * Encodes a deck to a `ydke` URI.
	 * Note that the deck name is not stored in the URI.
	 *
	 * @see #fromUri
	 *
	 * @param deck Deck to encode.
	 * @return `ydke` URI.
	 */
	toUri(deck: Deck): URL {
		return new URL(
			DeckUriEncodingService.#YDKE_URI_PROTOCOL + this.#encodeDeck(deck)
		);
	}

	/**
	 * Encodes a deck as a URI query parameter value.
	 *
	 * The value contains the deck contents encoded in the same fashion as ydke, plus the deck name it.
	 *
	 * Consumer should ensure this value is URL-encoded.
	 *
	 * @param deck Deck to encode.
	 * @return Value that can be decoded to yield the same deck.
	 */
	toUrlQueryParamValue(deck: Deck): string {
		return `${this.#encodeDeck(deck)}${deck.name ?? ""}`;
	}

	#encodeDeck(deck: Deck): string {
		const encodedDeckParts: string[] = [];
		for (const deckPart of DECK_PART_ARR) {
			const encodedCards: number[] = [];
			for (const card of deck.parts[deckPart]) {
				encodedCards.push(...this.#encodeCardBlock(card));
			}
			encodedDeckParts.push(
				this.#encodingService.encodeBase64String(
					Uint8Array.from(encodedCards),
					false
				)
			);
		}
		return (
			encodedDeckParts.join(DeckUriEncodingService.#YDKE_DELIMITER) +
			DeckUriEncodingService.#YDKE_DELIMITER
		);
	}

	/**
	 * Decodes a deck from a `ydke` URI.
	 *
	 * @see https://github.com/edo9300/edopro/issues/171
	 * @see https://github.com/AlphaKretin/bastion-bot/commit/0349cdced8ad2d2de5c4758ea7312197505e94ef
	 *
	 * @param uri `ydke` URI to decode
	 * @return Deck.
	 */
	fromUri(uri: string): Deck {
		return this.#decodeDeck(
			uri.slice(DeckUriEncodingService.#YDKE_URI_PROTOCOL.length)
		);
	}

	/**
	 * Creates a deck from a decoded query parameter value created by {@link toUrlQueryParamValue}.
	 *
	 * @param queryParamValue query parameter value.
	 * @return Deck.
	 */
	fromUrlQueryParamValue(queryParamValue: string): Deck {
		const additionalDataStartIndex =
			this.#nthIndexOf(
				queryParamValue,
				DeckUriEncodingService.#YDKE_DELIMITER,
				DeckUriEncodingService.#YDKE_DELIMITER_COUNT
			) + 1;
		const ydke = queryParamValue.substring(0, additionalDataStartIndex);
		const deckName = queryParamValue.substring(additionalDataStartIndex);

		const deck = this.#decodeDeck(ydke);
		if (deckName.length > 0) {
			deck.name = deckName;
		}
		return deck;
	}

	#decodeDeck(data: string): Deck {
		const uriParts = data.split(DeckUriEncodingService.#YDKE_DELIMITER);
		uriParts.pop(); // uriParts is always one longer than there are deck parts due to trailing delimiter.

		if (uriParts.length !== DeckUriEncodingService.#YDKE_DELIMITER_COUNT) {
			throw new Error(
				`Expected URI to have ${
					DeckUriEncodingService.#YDKE_DELIMITER_COUNT
				} delimiters but found ${uriParts.length}.`
			);
		}

		const deck = this.#deckService.createEmptyDeck();
		for (
			let deckPartIndex = 0;
			deckPartIndex < uriParts.length;
			deckPartIndex++
		) {
			const deckPartCards = deck.parts[DECK_PART_ARR[deckPartIndex]];
			const decodedDeckPartCards =
				this.#encodingService.decodeBase64String(
					uriParts[deckPartIndex],
					false
				);
			for (
				let blockStart = 0;
				blockStart < decodedDeckPartCards.length;
				blockStart += DeckUriEncodingService.#BLOCK_BYTE_SIZE
			) {
				const block = decodedDeckPartCards.slice(
					blockStart,
					blockStart + DeckUriEncodingService.#BLOCK_BYTE_SIZE
				);
				deckPartCards.push(this.#decodeCardBlock(block));
			}
		}
		return deck;
	}

	/**
	 * Variant of String.prototype.indexOf that returns the index of the nth occurrence of the target string.
	 */
	#nthIndexOf(haystack: string, needle: string, n: number): number {
		let count = 0;
		for (let i = 0; i < haystack.length; i++) {
			const char = haystack[i];
			if (char == needle) {
				count++;
			}
			if (count == n) {
				return i;
			}
		}
		return -1;
	}

	/**
	 * Creates a deck from a query parameter value created by toLegacyUrlQueryParamValue.
	 *
	 * @param queryParamValue query parameter value.
	 * @return Deck.
	 * @deprecated
	 */
	fromLegacyUrlQueryParamValue(queryParamValue: string): Deck {
		const deck = this.#deckService.createEmptyDeck();

		const decoded = this.#encodingService.decodeBase64String(
			queryParamValue,
			true
		);
		const inflated = inflateRaw(decoded);

		let deckPartIndex = 0;
		let metaDataStart: null | number = null;
		for (
			let blockStart = 0;
			blockStart < inflated.length;
			blockStart += DeckUriEncodingService.#BLOCK_BYTE_SIZE
		) {
			const blockEnd =
				blockStart + DeckUriEncodingService.#BLOCK_BYTE_SIZE;
			const block = inflated.slice(blockStart, blockEnd);

			if (
				isEqual(
					block,
					DeckUriEncodingService
						.#URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK
				)
			) {
				// After the last deck part, metadata starts
				if (deckPartIndex === DECK_PART_ARR.length - 1) {
					metaDataStart = blockEnd;
					break;
				}
				deckPartIndex++;
			} else {
				const deckPartCards = deck.parts[DECK_PART_ARR[deckPartIndex]];
				deckPartCards.push(this.#decodeCardBlock(block));
			}
		}
		if (metaDataStart != null && metaDataStart < inflated.length) {
			deck.name = this.#encodingService.decodeText(
				inflated.subarray(metaDataStart)
			);
		}
		return deck;
	}

	#encodeCardBlock(card: Card): Uint8Array {
		return this.#encodeNumber(Number(card.passcode));
	}

	#decodeCardBlock(block: Uint8Array): Card {
		const passcode = String(this.#decodeNumber(block));
		if (!this.#cardDatabase.hasCard(passcode, FindCardBy.PASSCODE)) {
			throw new TypeError(
				`Could not find card for passcode '${passcode}'.`
			);
		}

		return this.#cardDatabase.getCard(passcode, FindCardBy.PASSCODE)!;
	}

	#encodeNumber(number: number): Uint8Array {
		if (number <= 0 || number >= DeckUriEncodingService.#LIMIT) {
			throw new TypeError(
				`Number '${number} is of range (has to be > 0 and < ${
					DeckUriEncodingService.#LIMIT
				})'.`
			);
		}
		// Use a data view to set a 32 bit to the buffer, which is then returned as 8 bit array.
		const buffer = new ArrayBuffer(DeckUriEncodingService.#BLOCK_BYTE_SIZE);
		new DataView(buffer).setUint32(
			0,
			number,
			DeckUriEncodingService.#URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN
		);
		return new Uint8Array(buffer);
	}

	#decodeNumber(block: Uint8Array): number {
		// See #encodeNumber for details
		return new DataView(block.buffer).getUint32(
			0,
			DeckUriEncodingService.#URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN
		);
	}
}
