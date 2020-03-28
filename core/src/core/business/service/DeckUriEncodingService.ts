import { inject, injectable } from "inversify";
import { Deck } from "../../model/ygo/Deck";
import { TYPES } from "../../../types";
import { CardDatabase } from "../CardDatabase";
import { Card } from "../../model/ygo/Card";
import { CompressionService } from "./CompressionService";
import { isEqual } from "lodash";
import { DeckService } from "./DeckService";
import { EncodingService } from "./EncodingService";
import { DEFAULT_DECK_PART_ARR } from "../../model/ygo/DeckPart";

@injectable()
class DeckUriEncodingService {
    // 4 bytes is enough to hold a 32 bit integer which is able to store all 9 digit IDs
    private static readonly BLOCK_SIZE = 4;
    private static readonly DELIMITER_BLOCK: Uint8Array = new Uint8Array(
        DeckUriEncodingService.BLOCK_SIZE
    ).fill(0);
    private static readonly ID_LIMIT = 2 ** 32;

    private readonly encodingService: EncodingService;
    private readonly cardDatabase: CardDatabase;
    private readonly compressionService: CompressionService;
    private readonly deckService: DeckService;

    constructor(
        @inject(TYPES.CardDatabase)
        cardDatabase: CardDatabase,
        @inject(TYPES.DeckService)
        deckService: DeckService,
        @inject(TYPES.EncodingService)
        encodingService: EncodingService,
        @inject(TYPES.CompressionService)
        compressionService: CompressionService
    ) {
        this.encodingService = encodingService;
        this.compressionService = compressionService;
        this.deckService = deckService;
        this.cardDatabase = cardDatabase;
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
     * Blocks of {@link #BLOCK_SIZE} represent a single card ID number,
     * with a special value {@link #DELIMITER_BLOCK} being used to separate deck-parts.
     * After the last card of the last deckpart and the delimiter,
     * the UTF-8 code-points of the deck name follow, if one is set.
     *
     * @param deck
     * @return Value that can be decoded to yield the same deck.
     */
    public toUrlQueryParamValue(deck: Deck): string {
        const result: number[] = [];

        for (const deckPart of DEFAULT_DECK_PART_ARR) {
            for (const card of deck.parts.get(deckPart)!) {
                result.push(...this.encodeCard(card));
            }
            result.push(...DeckUriEncodingService.DELIMITER_BLOCK);
        }
        if (deck.name != null && deck.name !== "") {
            result.push(...this.encodingService.encodeString(deck.name));
        }

        const deflated = this.compressionService.deflate(result);
        return this.encodingService.encodeUriSafeBase64String(deflated);
    }

    /**
     * Creates a deck from a query parameter value created by {@link toUrlQueryParamValue}.
     *
     * @param queryParamValue query parameter value.
     * @return Deck.
     */
    public fromUrlQueryParamValue(queryParamValue: string): Deck {
        const deck = this.deckService.createEmptyDeck();

        const decoded = this.encodingService.decodeUriSafeBase64String(
            queryParamValue
        );
        const inflated = this.compressionService.inflate(decoded);

        let deckPartIndex = 0;
        let metaDataStart: null | number = null;
        for (
            let i = 0;
            i < inflated.length;
            i += DeckUriEncodingService.BLOCK_SIZE
        ) {
            const block = inflated.slice(
                i,
                i + DeckUriEncodingService.BLOCK_SIZE
            );
            if (isEqual(block, DeckUriEncodingService.DELIMITER_BLOCK)) {
                // After the last deckpart, meta data starts
                if (deckPartIndex === DEFAULT_DECK_PART_ARR.length - 1) {
                    metaDataStart = i + DeckUriEncodingService.BLOCK_SIZE;
                    break;
                }
                deckPartIndex++;
            } else {
                const deckPart = deck.parts.get(
                    DEFAULT_DECK_PART_ARR[deckPartIndex]
                )!;
                deckPart.push(this.decodeCard(block));
            }
        }
        if (metaDataStart != null && metaDataStart < inflated.length) {
            deck.name = this.encodingService.decodeString(
                inflated.subarray(metaDataStart)
            );
        }
        return deck;
    }

    public fromLegacyUrlQueryParamValue(
        val: string,
        base64Decoder: (val: string) => string
    ): Deck {
        const deck = this.deckService.createEmptyDeck();
        const uncompressedValue = this.compressionService.inflateString(
            base64Decoder(val)
        );

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

                        if (!this.cardDatabase.hasCard(cardId)) {
                            throw new TypeError(
                                `Unknown card ${cardId}, this hopefully should never happen.`
                            );
                        }
                        const card = this.cardDatabase.getCard(cardId)!;

                        for (let i = 0; i < count; i++) {
                            deckPartCards.push(card);
                        }
                    });
                }
            });

        return deck;
    }

    private encodeCard(card: Card): Uint8Array {
        const idNumber = Number(card.id);
        if (idNumber === 0 || idNumber >= DeckUriEncodingService.ID_LIMIT) {
            throw new TypeError(
                `Card '${card}' has an illegal value ${idNumber} as ID.`
            );
        }
        const buffer = new ArrayBuffer(DeckUriEncodingService.BLOCK_SIZE);
        // Use a data view to set a 32 bit to the buffer, which is then returned as 8 bit array.
        const dataView = new DataView(buffer);
        dataView.setUint32(0, idNumber, true);
        return new Uint8Array(buffer);
    }

    private decodeCard(block: Uint8Array): Card {
        const dataView = new DataView(block.buffer);
        // See #encodeCard for details
        const cardId = String(dataView.getUint32(0, true));
        if (!this.cardDatabase.hasCard(cardId)) {
            throw new TypeError(`Could not find card for ID ${cardId}.`);
        }

        return this.cardDatabase.getCard(cardId)!;
    }
}

export { DeckUriEncodingService };
