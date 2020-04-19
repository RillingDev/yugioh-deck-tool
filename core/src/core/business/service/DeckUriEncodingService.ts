import { inject, injectable } from "inversify";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { CardDatabase, FindCardBy } from "../CardDatabase";
import { Card } from "../../model/ygo/Card";
import { isEqual } from "lodash";
import { DeckService } from "./DeckService";
import { DEFAULT_DECK_PART_ARR } from "../../model/ygo/DeckPart";
import { fromByteArray, toByteArray } from "base64-js";
import { deflateRaw, inflate, inflateRaw } from "pako";

/**
 * @public
 */
@injectable()
class DeckUriEncodingService {
    // A 32 bit integer is able to store all 9 digit IDs
    // Note that currently we assume only little endian systems are used.
    private static readonly BLOCK_BYTE_SIZE = Uint32Array.BYTES_PER_ELEMENT;
    private static readonly DELIMITER_BLOCK: Uint8Array = new Uint8Array(
        DeckUriEncodingService.BLOCK_BYTE_SIZE
    ).fill(0);
    private static readonly ID_LIMIT =
        2 ** (DeckUriEncodingService.BLOCK_BYTE_SIZE * 8); // Max number that can be stored in BLOCK_BYTE_SIZE bytes.

    private static readonly USE_LITTLE_ENDIAN = true;

    private readonly cardDatabase: CardDatabase;
    private readonly deckService: DeckService;
    private readonly textEncoder: TextEncoder;
    private readonly textDecoder: TextDecoder;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.DeckService)
        deckService: DeckService
    ) {
        this.deckService = deckService;
        this.cardDatabase = cardDatabase;
        this.textEncoder = new TextEncoder();
        this.textDecoder = new TextDecoder();
    }

    /**
     * Encodes a deck to a URI query parameter value safe string.
     *
     * Encoding steps:
     * <ol>
     *     <li>Create byte array of deck name and cards (see below)</li>
     *     <li>Deflate the byte array to producer shorter results</li>
     *     <li>Base64 encode the value with an URI safe alphabet to allow usage in URI query parameter values</li>
     * </ol>
     *
     * Byte Array structure:
     * Blocks of {@link #BLOCK_BYTE_SIZE} represent a single card ID number,
     * with a special value {@link #DELIMITER_BLOCK} being used to separate deck-parts.
     * After the last card of the last deckpart and the delimiter,
     * the UTF-8 code-points of the deck name follow, if one is set.
     *
     * @param deck
     * @return Value that can be decoded to yield the same deck.
     */
    public toUrlQueryParamValue(deck: Deck): string {
        const result: number[] = []; // Array of unsigned 8 bit numbers, using this over Uint8Array for convenience.

        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            for (const card of deck.parts.get(deckPart)!) {
                result.push(...this.encodeCardBlock(card));
            }
            result.push(...DeckUriEncodingService.DELIMITER_BLOCK);
        }
        if (deck.name != null && deck.name !== "") {
            result.push(...this.textEncoder.encode(deck.name));
        }

        const deflated = deflateRaw(result);
        return this.encodeUriSafeBase64String(deflated);
    }

    /**
     * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
     *
     * @param queryParamValue query parameter value.
     * @return Deck.
     */
    public fromUrlQueryParamValue(queryParamValue: string): Deck {
        const deck = this.deckService.createEmptyDeck();

        const decoded = this.decodeUriSafeBase64String(queryParamValue);
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

            if (isEqual(block, DeckUriEncodingService.DELIMITER_BLOCK)) {
                // After the last deckpart, meta data starts
                if (deckPartIndex === DEFAULT_DECK_PART_ARR.length - 1) {
                    metaDataStart = blockEnd;
                    break;
                }
                deckPartIndex++;
            } else {
                const deckPart = deck.parts.get(
                    DEFAULT_DECK_PART_ARR[deckPartIndex]
                )!;
                deckPart.push(this.decodeCardBlock(block));
            }
        }
        if (metaDataStart != null && metaDataStart < inflated.length) {
            deck.name = this.textDecoder.decode(
                inflated.subarray(metaDataStart)
            );
        }
        return deck;
    }

    /**
     * @deprecated
     */
    public fromLegacyUrlQueryParamValue(
        val: string,
        base64Decoder: (val: string) => string
    ): Deck {
        const deck = this.deckService.createEmptyDeck();
        const uncompressedValue = inflate(base64Decoder(val), {
            to: "string",
        });

        const DELIMITERS = {
            deckPart: "|",
            cardId: ";",
            cardAmount: "*",
        };

        uncompressedValue
            .split(DELIMITERS.deckPart)
            .forEach((deckPartList: string, index) => {
                const deckPart = DEFAULT_DECK_PART_ARR[index];
                const deckPartCards = deck.parts.get(deckPart)!;

                if (deckPartList.length > 0) {
                    deckPartList.split(DELIMITERS.cardId).forEach((entry) => {
                        let count = 1;
                        let cardId = entry;
                        if (entry.startsWith(DELIMITERS.cardAmount)) {
                            count = Number(entry[1]);
                            cardId = entry.slice(2);
                        }

                        if (!this.cardDatabase.hasCard(cardId, FindCardBy.ID)) {
                            throw new TypeError(
                                `Unknown card ${cardId}, this hopefully should never happen.`
                            );
                        }
                        const card = this.cardDatabase.getCard(
                            cardId,
                            FindCardBy.ID
                        )!;

                        for (let i = 0; i < count; i++) {
                            deckPartCards.push(card);
                        }
                    });
                }
            });

        return deck;
    }

    private encodeCardBlock(card: Card): Uint8Array {
        return this.encodeNumber(Number(card.id));
    }

    private decodeCardBlock(block: Uint8Array): Card {
        const id = String(this.decodeNumber(block));
        if (!this.cardDatabase.hasCard(id, FindCardBy.ID)) {
            throw new TypeError(`Could not find card for ID ${id}.`);
        }

        return this.cardDatabase.getCard(id, FindCardBy.ID)!;
    }

    private encodeNumber(number: number): Uint8Array {
        if (number <= 0 || number >= DeckUriEncodingService.ID_LIMIT) {
            throw new TypeError(
                `Number '${number} is of range (has to be > 0 and < ${DeckUriEncodingService.ID_LIMIT})'.`
            );
        }
        // Use a data view to set a 32 bit to the buffer, which is then returned as 8 bit array.
        const buffer = new ArrayBuffer(DeckUriEncodingService.BLOCK_BYTE_SIZE);
        new DataView(buffer).setUint32(
            0,
            number,
            DeckUriEncodingService.USE_LITTLE_ENDIAN
        );
        return new Uint8Array(buffer);
    }

    private decodeNumber(block: Uint8Array): number {
        // See #encodeNumber for details
        return new DataView(block.buffer).getUint32(
            0,
            DeckUriEncodingService.USE_LITTLE_ENDIAN
        );
    }

    private encodeUriSafeBase64String(arr: Uint8Array): string {
        return fromByteArray(arr)
            .replace(/=/g, "~")
            .replace(/\+/g, "_")
            .replace(/\//g, "-");
    }

    private decodeUriSafeBase64String(str: string): Uint8Array {
        return toByteArray(
            str.replace(/~/g, "=").replace(/_/g, "+").replace(/-/g, "/")
        );
    }
}

export { DeckUriEncodingService };
