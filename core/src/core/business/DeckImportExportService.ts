import { inject, injectable } from "inversify";
import { Deck } from "../model/Deck";
import { TYPES } from "../../types";
import { CardDatabase } from "./CardDatabase";
import { Card } from "../model/Card";
import { DEFAULT_DECKPART_ARR } from "../model/DefaultDeckPart";
import { CompressionService } from "./CompressionService";
import { isEqual } from "lodash";
import { groupMapReducingBy } from "lightdash";
import { DeckService } from "./DeckService";
import { EncodingService } from "./EncodingService";

interface ImportResult {
    readonly deck: Deck;
    readonly missing: string[];
}

interface DeckFile {
    readonly fileName: string;
    readonly fileContent: string;
}

@injectable()
class DeckImportExportService {
    // 4 bytes is enough to hold a 32 bit integer which is able to store all 9 digit IDs
    private static readonly BLOCK_SIZE = 4;
    private static readonly DELIMITER_BLOCK: Uint8Array = new Uint8Array(
        DeckImportExportService.BLOCK_SIZE
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

    public fromFile(deckFile: DeckFile): ImportResult {
        const missing: string[] = [];
        const deck = this.deckService.createEmptyDeck();

        const lines = deckFile.fileContent
            .split("\n")
            .map(line => line.trim())
            .filter(line => line.length > 0);
        let currentDeckPart = null;
        for (const line of lines) {
            const foundDeckPart = DEFAULT_DECKPART_ARR.find(
                part => part.indicator === line
            );
            if (foundDeckPart != null) {
                currentDeckPart = foundDeckPart;
                continue;
            }

            // Only start processing once a deckpart indicator was found. this allows for arbitrary file metadata as "head" of the file.
            if (currentDeckPart != null) {
                if (!this.cardDatabase.hasCard(line)) {
                    missing.push(line);
                } else {
                    const card = this.cardDatabase.getCard(line)!;
                    deck.parts.get(currentDeckPart)!.push(card);
                }
            }
        }
        deck.name = deckFile.fileName.replace(".ydk", "");
        return {
            deck,
            missing
        };
    }

    public toFile(deck: Deck): DeckFile {
        const fileLines: string[] = [];

        for (const deckPart of DEFAULT_DECKPART_ARR) {
            const deckPartCards = deck.parts.get(deckPart)!;
            fileLines.push(deckPart.indicator);
            fileLines.push(...deckPartCards.map(card => card.id));
            fileLines.push("");
        }

        return {
            fileName: `${deck.name}.ydk`,
            fileContent: fileLines.join("\n")
        };
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

        for (const deckPart of DEFAULT_DECKPART_ARR) {
            for (const card of deck.parts.get(deckPart)!) {
                result.push(...this.encodeCard(card));
            }
            result.push(...DeckImportExportService.DELIMITER_BLOCK);
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
            i += DeckImportExportService.BLOCK_SIZE
        ) {
            const block = inflated.subarray(
                i,
                i + DeckImportExportService.BLOCK_SIZE
            );
            if (isEqual(block, DeckImportExportService.DELIMITER_BLOCK)) {
                // After the last deckpart, meta data starts
                if (deckPartIndex === DEFAULT_DECKPART_ARR.length - 1) {
                    metaDataStart = i + DeckImportExportService.BLOCK_SIZE;
                    break;
                }
                deckPartIndex++;
            } else {
                const deckPart = deck.parts.get(
                    DEFAULT_DECKPART_ARR[deckPartIndex]
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
            cardAmount: "*"
        };

        uncompressedValue
            .split(DELIMITERS.deckPart)
            .forEach((deckPartList: string, index) => {
                const deckPart = DEFAULT_DECKPART_ARR[index];
                const deckPartCards = deck.parts.get(deckPart)!;

                if (deckPartList.length > 0) {
                    deckPartList.split(DELIMITERS.cardId).forEach(entry => {
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

    public toShareableText(deck: Deck): string {
        const result = [];
        for (const deckPart of DEFAULT_DECKPART_ARR) {
            result.push(`${deckPart.name}:`);

            const deckPartCards = deck.parts.get(deckPart)!;
            const counted: Map<Card, number> = this.countCards(deckPartCards);
            for (const [card, count] of counted.entries()) {
                result.push(`${card.name} x${count}`);
            }
            result.push("");
        }
        return result.join("\n");
    }

    public toBuyLink(deck: Deck): string {
        const counted: Map<Card, number> = this.countCards(
            this.deckService.getAllCards(deck)
        );
        const cardList = Array.from(counted.entries()).map(
            ([card, count]) => `${count} ${card.name}`
        );
        return (
            "https://store.tcgplayer.com/massentry?partner=YGOPRODeck&productline=Yugioh&c=" +
            encodeURIComponent(["", ...cardList, ""].join("||"))
        );
    }

    private encodeCard(card: Card): Uint8Array {
        const idNumber = Number(card.id);
        if (idNumber === 0 || idNumber >= DeckImportExportService.ID_LIMIT) {
            throw new TypeError(
                `Card '${card}' has an illegal value ${idNumber} as ID.`
            );
        }
        const buffer = new ArrayBuffer(DeckImportExportService.BLOCK_SIZE);
        // Create a 32 bit int view which allows easy access to the 4 byte
        // representation of the 32 bit number we set on it.
        const uint32Array = new Uint32Array(buffer);
        uint32Array[0] = idNumber;
        return new Uint8Array(buffer);
    }

    private decodeCard(block: Uint8Array): Card {
        // Copy input array to allow buffer access
        const uint8Array = new Uint8Array(block);
        // See #encodeCard for details
        const uint32Array = new Uint32Array(uint8Array.buffer);
        const cardId = String(uint32Array[0]);
        if (!this.cardDatabase.hasCard(cardId)) {
            throw new TypeError(`Could not find card for ID ${cardId}.`);
        }

        return this.cardDatabase.getCard(cardId)!;
    }

    private countCards(cards: Card[]): Map<Card, number> {
        return groupMapReducingBy(
            cards,
            card => card,
            () => 0,
            current => current + 1
        );
    }
}

export { DeckImportExportService };
