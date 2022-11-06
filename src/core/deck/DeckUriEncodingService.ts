import type { Deck } from "./Deck";
import type { CardDatabase } from "../card/CardDatabase";
import { FindCardBy } from "../card/CardDatabase";

import type { Card } from "../card/Card";
import { isEqual } from "lodash";
import type { DeckService } from "./DeckService";
import { deflateRaw, inflateRaw } from "pako";
import { DECK_PART_ARR } from "./DeckPart";
import type { EncodingService } from "../util/EncodingService";

export class DeckUriEncodingService {
	// A 32-bit integer is able to store all 8 digit passcodes
	// Note that currently we assume only little endian systems are used.
	private static readonly BLOCK_BYTE_SIZE = Uint32Array.BYTES_PER_ELEMENT;
	private static readonly LIMIT =
		2 ** (DeckUriEncodingService.BLOCK_BYTE_SIZE * 8); // Max number that can be stored in BLOCK_BYTE_SIZE bytes.

	private static readonly URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK: Uint8Array =
		new Uint8Array(DeckUriEncodingService.BLOCK_BYTE_SIZE).fill(0);
	private static readonly URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN = true;

	private static readonly YDKE_URI_PROTOCOL = "ydke://";
	private static readonly YDKE_DELIMITER = "!";

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
		const encodedDeckParts: string[] = [];
		for (const deckPart of DECK_PART_ARR) {
			const encodedCards = [];
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
		return new URL(
			DeckUriEncodingService.YDKE_URI_PROTOCOL +
				encodedDeckParts.join(DeckUriEncodingService.YDKE_DELIMITER) +
				DeckUriEncodingService.YDKE_DELIMITER
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
		const uriParts = uri
			.slice(DeckUriEncodingService.YDKE_URI_PROTOCOL.length)
			.split(DeckUriEncodingService.YDKE_DELIMITER);
		uriParts.pop(); // uriParts is always one longer than there are deck parts due to trailing delimiter.

		if (uriParts.length !== DECK_PART_ARR.length) {
			throw new Error(
				`Expected URI to have ${DECK_PART_ARR.length} delimiters but found ${uriParts.length}.`
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
				blockStart += DeckUriEncodingService.BLOCK_BYTE_SIZE
			) {
				const block = decodedDeckPartCards.slice(
					blockStart,
					blockStart + DeckUriEncodingService.BLOCK_BYTE_SIZE
				);
				deckPartCards.push(this.#decodeCardBlock(block));
			}
		}
		return deck;
	}

	/**
	 * Encodes a deck to a URI query parameter value safe string.
	 *
	 * Encoding steps:
	 * <ol>
	 *     <li>Create byte array of deck name and cards (see below)</li>
	 *     <li>Deflate the byte array to producer shorter results</li>
	 *     <li>Base64 encode the value with a URI safe alphabet to allow usage in URI query parameter values</li>
	 * </ol>
	 *
	 * Byte Array structure:
	 * Blocks of {@link #BLOCK_BYTE_SIZE} represent a single card passcode number,
	 * with a special value {@link #URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK} being used to separate deck-parts.
	 * After the last card of the last deck part and the delimiter,
	 * the UTF-8 code-points of the deck name follow, if one is set.
	 *
	 * @param deck Deck to encode.
	 * @return Value that can be decoded to yield the same deck.
	 */
	toUrlQueryParamValue(deck: Deck): string {
		const result: number[] = []; // Array of unsigned 8-bit numbers, using this over Uint8Array for convenience.

		for (const deckPart of DECK_PART_ARR) {
			for (const card of deck.parts[deckPart]) {
				result.push(...this.#encodeCardBlock(card));
			}
			result.push(
				...DeckUriEncodingService.URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK
			);
		}
		if (deck.name != null && deck.name !== "") {
			result.push(...this.#encodingService.encodeText(deck.name));
		}

		const deflated = deflateRaw(Uint8Array.from(result));
		return this.#encodingService.encodeBase64String(deflated, true);
	}

	/**
	 * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
	 *
	 * @param queryParamValue query parameter value.
	 * @return Deck.
	 */
	fromUrlQueryParamValue(queryParamValue: string): Deck {
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
			blockStart += DeckUriEncodingService.BLOCK_BYTE_SIZE
		) {
			const blockEnd =
				blockStart + DeckUriEncodingService.BLOCK_BYTE_SIZE;
			const block = inflated.slice(blockStart, blockEnd);

			if (
				isEqual(
					block,
					DeckUriEncodingService.URL_QUERY_PARAM_VALUE_DELIMITER_BLOCK
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
		if (number <= 0 || number >= DeckUriEncodingService.LIMIT) {
			throw new TypeError(
				`Number '${number} is of range (has to be > 0 and < ${DeckUriEncodingService.LIMIT})'.`
			);
		}
		// Use a data view to set a 32 bit to the buffer, which is then returned as 8 bit array.
		const buffer = new ArrayBuffer(DeckUriEncodingService.BLOCK_BYTE_SIZE);
		new DataView(buffer).setUint32(
			0,
			number,
			DeckUriEncodingService.URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN
		);
		return new Uint8Array(buffer);
	}

	#decodeNumber(block: Uint8Array): number {
		// See #encodeNumber for details
		return new DataView(block.buffer).getUint32(
			0,
			DeckUriEncodingService.URL_QUERY_PARAM_VALUE_LITTLE_ENDIAN
		);
	}
}
